import { useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  X, 
  AlertCircle,
  Loader2,
  Navigation
} from 'lucide-react';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={DefaultIcon} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          setPosition(e.target.getLatLng());
        }
      }}
    />
  );
};

const Report = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    city: '',
    neighborhood: '',
    description: '',
    location: { lat: 36.8065, lng: 10.1815 } // Default to Tunis
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { id: 'Roads', label: 'Roads / Potholes', icon: '🛣️' },
    { id: 'Lighting', label: 'Broken Lights', icon: '💡' },
    { id: 'Sanitation', label: 'Sanitation', icon: '🗑️' },
    { id: 'Water', label: 'Water Leaks', icon: '💧' },
    { id: 'Other', label: 'Other Issue', icon: '⚠️' }
  ];

  const neighborhoodsByCity = {
    "Ariana": ["Ariana Ville", "Ettadhamen", "Mnihla", "Raoued", "Sidi Thabet", "Soukra", "Kalaat el-Andalous"],
    "Béja": ["Béja Nord", "Béja Sud", "Amdoun", "Goubellat", "Medjez el-Bab", "Nefza", "Teboursouk", "Testour", "Thibar"],
    "Ben Arous": ["Ben Arous", "Bou Mhel", "El Mourouj", "Ezzahra", "Fouchana", "Hammam Chott", "Hammam Lif", "Mohamedia", "Mornag", "Radès", "Yasminet", "Khalidia"],
    "Bizerte": ["Bizerte Nord", "Bizerte Sud", "Ghar El Melh", "Mateur", "Menzel Bourguiba", "Menzel Jemil", "Ras Jebel", "Sejnane", "Utique", "Joumine", "Ghazala", "Tinja"],
    "Gabès": ["Gabès Ville", "Gabès Ouest", "Gabès Sud", "El Hamma", "Mareth", "Matmata", "Metouia", "Ghannouch", "Menzel El Habib"],
    "Gafsa": ["Gafsa Ville", "Gafsa Nord", "El Ksar", "Mdhilla", "Metlaoui", "Moularès", "Redeyef", "Sened", "Sidi Aïch", "Om El Larays"],
    "Jendouba": ["Jendouba Ville", "Jendouba Nord", "Aïn Draham", "Balta-Bou Aouane", "Bou Salem", "Fernana", "Ghardimaou", "Tabarka", "Oued Mliz"],
    "Kairouan": ["Kairouan Nord", "Kairouan Sud", "Bou Hajla", "Haffouz", "Nasrallah", "Oueslatia", "Sbikha", "Chebika", "Alaâ", "Hajeb El Ayoun"],
    "Kasserine": ["Kasserine Nord", "Kasserine Sud", "Fériana", "Sbeïtla", "Thala", "Foussana", "Haidra", "Jedeliane", "Majel Bel Abbès", "Sbiba"],
    "Kébili": ["Kébili Nord", "Kébili Sud", "Douz North", "Douz South", "Souk Lahad", "Faouar"],
    "Kef": ["Kef Est", "Kef Ouest", "Dahmani", "Jerissa", "Sakiet Sidi Youssef", "Tajerouine", "Kalâat Khasba", "Kalaat Senan", "Nebeur", "Sers"],
    "Mahdia": ["Mahdia Ville", "Bou Merdes", "Chebba", "El Jem", "Ksour Essef", "Ouled Chamekh", "Chorbane", "Hebira", "Melloulèche", "Sidi Alouane"],
    "Manouba": ["Manouba Ville", "Den Den", "Douar Hicher", "Mornaguia", "Oued Ellil", "Tebourba", "Borj El Amri", "El Battane"],
    "Médenine": ["Médenine Nord", "Médenine Sud", "Ben Guerdane", "Djerba Ajim", "Djerba Houmt Souk", "Djerba Midoun", "Zarzis", "Beni Khedache", "Sidi Makhlouf"],
    "Monastir": ["Monastir Ville", "Bekalta", "Jemmal", "Ksar Hellal", "Moknine", "Ouerdanine", "Sahline", "Téboulba", "Bembla", "Beni Hassen", "Sayada-Lamta-Bou Hajar", "Ksibat el-Médiouni"],
    "Nabeul": ["Nabeul Ville", "Béni Khiar", "Hammamet", "Kélibia", "Korba", "Menzel Temime", "Soliman", "Béni Khalled", "Bou Argoub", "Dar Chaâbane El Fehri", "El Haouaria", "Grombalia", "Menzel Bouzelfa", "Takilsa"],
    "Sfax": ["Sfax Ville", "Sfax Ouest", "Sfax Sud", "Sakiet Eddaïer", "Sakiet Ezzit", "Agareb", "Kerkennah", "Mahrès", "Thyna", "Bir Ali Ben Khalifa", "El Hencha", "Graïba", "Jebiniana", "Skhira"],
    "Sidi Bouzid": ["Sidi Bouzid Est", "Sidi Bouzid Ouest", "Bir El Hafey", "Jilma", "Meknassy", "Regueb", "Ben Oun", "Cebbala Ouled Asker", "Menzel Bouzaiane", "Mezzouna", "Ouled Haffouz"],
    "Siliana": ["Siliana Ville", "Siliana Nord", "Siliana Sud", "Bou Arada", "Gaâfour", "Makthar", "Rouhia", "Bargou", "El Krib", "Kesra"],
    "Sousse": ["Sousse Ville", "Sousse Jawhara", "Sousse Riadh", "Sousse Sidi Abdelhamid", "Akouda", "Hammam Sousse", "Kalaâ Kebira", "Kalaâ Seghira", "M'saken", "Port El Kantaoui", "Bouficha", "Enfidha", "Kondar", "Sidi Bou Ali", "Sidi El Hani"],
    "Tataouine": ["Tataouine Nord", "Tataouine Sud", "Ghomrassen", "Remada", "Smâr", "Bir Lahmar", "Dehiba"],
    "Tozeur": ["Tozeur Ville", "Degache", "Hazoua", "Nefta", "Tameghza"],
    "Tunis": ["Medina", "Bab El Bhar", "Bab Souika", "Carthage", "Cité El Khadra", "El Menzah", "El Omrane", "El Ouardia", "Ezzouhour", "Hraïria", "Jebel Jelloud", "La Goulette", "La Marsa", "Le Bardo", "Le Kram", "Sidi El Béchir", "Sidi Hassine", "Sidi Bou Saïd", "La Goulette"],
    "Zaghouan": ["Zaghouan Ville", "Bir Mcherga", "El Fahs", "Nadhour", "Zriba", "Saouaf"]
  };

  const tunisCities = Object.keys(neighborhoodsByCity).sort();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLocationChange = (latlng) => {
    setFormData(prev => ({ 
      ...prev, 
      location: { lat: latlng.lat, lng: latlng.lng } 
    }));
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        handleLocationChange({ 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        });
      }, (err) => {
        console.error(err);
        setError('Could not get your current location.');
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to submit a report.');
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      let imageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `reports/${Date.now()}_${imageFile.name}`);
        const uploadTask = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, 'reports'), {
        ...formData,
        imageUrl,
        status: 'Reported',
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        upvotes: [],
        commentCount: 0
      });

      navigate('/browse');
    } catch (err) {
      console.error(err);
      setError('An error occurred while submitting the report. Please try again.');
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.category) return;
    if (step === 2 && (!formData.city || !formData.neighborhood)) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="view">
      <div className="container" style={{ maxWidth: '800px' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Report an Issue</h2>
          <p className="section-subtitle">Help us improve Tunisia by reporting infrastructure or safety concerns in your area.</p>
        </header>

        {/* Custom Progress Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem', gap: '0.5rem' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: step >= s ? 'var(--clr-primary)' : 'var(--clr-bg-raised)',
                color: step >= s ? 'white' : 'var(--clr-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 800,
                transition: 'var(--trans-md)',
                boxShadow: step === s ? '0 0 0 4px var(--clr-primary-glow)' : 'none'
              }}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              {s < 4 && (
                <div style={{ 
                  width: '40px', 
                  height: '3px', 
                  backgroundColor: step > s ? 'var(--clr-primary)' : 'var(--clr-border)',
                  borderRadius: 'var(--r-full)',
                  transition: 'var(--trans-md)'
                }} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="card-premium" style={{ padding: '3rem', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            {/* STEP 1: CATEGORY */}
            {step === 1 && (
              <motion.div 
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>What kind of issue are you reporting?</h3>
                <div className="grid-3" style={{ gap: '1.5rem' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setFormData({ ...formData, category: cat.id });
                        nextStep();
                      }}
                      className={`card ${formData.category === cat.id ? 'active' : ''}`}
                      style={{
                        padding: '2.5rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.25rem',
                        cursor: 'pointer',
                        borderColor: formData.category === cat.id ? 'var(--clr-primary)' : 'var(--clr-border)',
                        backgroundColor: formData.category === cat.id ? 'var(--clr-primary-ultra)' : 'var(--clr-surface)',
                        transition: 'var(--trans-sm)'
                      }}
                    >
                      <span style={{ fontSize: '3rem' }}>{cat.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: LOCATION */}
            {step === 2 && (
              <motion.div 
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Where is it located?</h3>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">City / Governorate</label>
                    <select 
                      className="form-control"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value, neighborhood: '' })}
                    >
                      <option value="">Select City</option>
                      {tunisCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Neighborhood / Area</label>
                    <select 
                      className="form-control"
                      value={formData.neighborhood}
                      disabled={!formData.city}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    >
                      <option value="">Select Neighborhood</option>
                      {formData.city && neighborhoodsByCity[formData.city]?.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Pin precise location on map (Optional)</span>
                  <button 
                    type="button"
                    onClick={getUserLocation}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--clr-primary)', gap: '0.4rem' }}
                  >
                    <Navigation size={14} /> Use My Location
                  </button>
                </div>
                
                <div style={{ height: '300px', width: '100%', borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1.5px solid var(--clr-border)', marginBottom: '2rem' }}>
                  <MapContainer center={[formData.location.lat, formData.location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={formData.location} setPosition={handleLocationChange} />
                  </MapContainer>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                  <button onClick={prevStep} className="btn btn-outline" style={{ flex: 1 }}>
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button 
                    onClick={nextStep} 
                    disabled={!formData.city || !formData.neighborhood}
                    className="btn btn-primary" 
                    style={{ flex: 1.5 }}
                  >
                    Next: Add Evidence <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: EVIDENCE */}
            {step === 3 && (
              <motion.div 
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ textAlign: 'center' }}
              >
                <h3 style={{ marginBottom: '1rem' }}>Attach Photo Evidence</h3>
                <p style={{ color: 'var(--clr-text-light)', marginBottom: '2.5rem' }}>
                  Adding a photo helps authorities understand the severity and location of the issue faster.
                </p>

                {!imagePreview ? (
                  <label className="photo-upload-zone">
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--clr-primary-ultra)', 
                        color: 'var(--clr-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Upload size={32} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--clr-text)' }}>Click to upload or take a photo</p>
                        <p style={{ fontSize: '0.85rem' }}>PNG, JPG or JPEG (Max 5MB)</p>
                      </div>
                    </div>
                  </label>
                ) : (
                  <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ width: '100%', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-md)', maxHeight: '300px', objectFit: 'cover' }} 
                    />
                    <button 
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      style={{ 
                        position: 'absolute', 
                        top: '-10px', 
                        right: '-10px', 
                        backgroundColor: 'var(--clr-error)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '32px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-md)'
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                  <button onClick={prevStep} className="btn btn-outline" style={{ flex: 1 }}>
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button onClick={nextStep} className="btn btn-primary" style={{ flex: 1.5 }}>
                    {imageFile ? 'Looks Good' : 'Skip & Continue'} <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: DETAILS */}
            {step === 4 && (
              <motion.div 
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Final Details</h3>
                
                <div className="form-group">
                  <label className="form-label">Issue Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Briefly describe the problem (e.g. Large Pothole on main road)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea 
                    className="form-control" 
                    rows="6"
                    placeholder="Provide more details to help us identify the exact problem..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button onClick={prevStep} className="btn btn-outline" style={{ flex: 1 }}>
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={submitting || !formData.title || !formData.description}
                    className="btn btn-primary" 
                    style={{ flex: 2 }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="spinner" size={18} /> Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> Submit Official Report
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Report;
