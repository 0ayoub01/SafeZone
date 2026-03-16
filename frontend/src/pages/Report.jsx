import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

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
    lat: '',
    lng: ''
  });
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

  const tunisCities = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", 
    "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine", 
    "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", 
    "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  const [manualNeighborhood, setManualNeighborhood] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset neighborhood if city changes and it's not in manual mode
    if (name === 'city') {
      setFormData(prev => ({ ...prev, neighborhood: '' }));
      setManualNeighborhood(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFormData({ ...formData, category: categoryId });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      location: {
        lat: parseFloat(formData.lat) || 36.8065,
        lng: parseFloat(formData.lng) || 10.1815
      }
    };

    try {
      await addDoc(collection(db, 'reports'), {
        ...payload,
        status: 'Reported',
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email
      });
      navigate('/browse');
    } catch (err) {
      console.error(err);
      setError('An error occurred while submitting the report.');
      setSubmitting(false);
    }
  };

  const renderProgress = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '0.5rem' }}>
      {[1, 2, 3].map((s) => (
        <div 
          key={s} 
          style={{ 
            width: '40px', 
            height: '8px', 
            borderRadius: '4px', 
            backgroundColor: step >= s ? 'var(--clr-primary)' : '#e0e0e0',
            transition: 'background-color 0.3s ease'
          }} 
        />
      ))}
    </div>
  );

  return (
    <div className="view container" style={{ maxWidth: '800px' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--clr-text)' }}>Report an Issue</h2>
        <p style={{ color: 'var(--clr-text-light)' }}>Help us make Tunisia better, one report at a time.</p>
      </header>

      {renderProgress()}

      {error && (
        <div style={{ 
          color: 'white', 
          backgroundColor: 'var(--clr-primary)', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div style={{ 
        background: 'var(--clr-white)', 
        padding: '2.5rem', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-md)',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* STEP 1: CATEGORY */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>What's the problem about?</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '2rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--clr-border)',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: formData.category === cat.id ? 'scale(1.05)' : 'none',
                    borderColor: formData.category === cat.id ? 'var(--clr-primary)' : 'var(--clr-border)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--clr-primary)';
                    e.currentTarget.style.backgroundColor = 'rgba(231, 0, 19, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (formData.category !== cat.id) {
                      e.currentTarget.style.borderColor = 'var(--clr-border)';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>{cat.icon}</span>
                  <span style={{ fontWeight: '600', color: 'var(--clr-text)' }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Where is it located?</h3>
            
            <div className="form-group">
              <label className="form-label">City</label>
              <select 
                name="city" 
                className="form-control" 
                value={formData.city} 
                onChange={handleChange}
              >
                <option value="">Select a City</option>
                {tunisCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {formData.city && (
              <div className="form-group" style={{ animation: 'fadeIn 0.3s ease' }}>
                <label className="form-label">Neighborhood / Area</label>
                {!manualNeighborhood && neighborhoodsByCity[formData.city] ? (
                  <select
                    name="neighborhood"
                    className="form-control"
                    value={formData.neighborhood}
                    onChange={(e) => {
                      if (e.target.value === "other_manual") {
                        setManualNeighborhood(true);
                        setFormData({ ...formData, neighborhood: '' });
                      } else {
                        handleChange(e);
                      }
                    }}
                  >
                    <option value="">Select a Neighborhood</option>
                    {neighborhoodsByCity[formData.city].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                    <option value="other_manual">+ Other / Enter Manually</option>
                  </select>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      name="neighborhood" 
                      className="form-control" 
                      placeholder="Enter neighborhood or street name" 
                      value={formData.neighborhood} 
                      onChange={handleChange}
                    />
                    {neighborhoodsByCity[formData.city] && (
                      <button 
                        type="button"
                        onClick={() => setManualNeighborhood(false)}
                        style={{ 
                          position: 'absolute', 
                          right: '10px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--clr-primary)',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Back to list
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={() => setStep(1)} 
                className="btn btn-outline" 
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!formData.city || !formData.neighborhood}
                className="btn btn-primary" 
                style={{ flex: 2 }}
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DETAILS */}
        {step === 3 && (
          <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.4s ease' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Final Details</h3>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input 
                type="text" 
                name="title" 
                className="form-control" 
                placeholder="A short descriptive title" 
                value={formData.title} 
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                name="description" 
                className="form-control" 
                placeholder="Give us more details about the issue..." 
                value={formData.description} 
                onChange={handleChange}
                required
                style={{ minHeight: '150px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                type="button"
                onClick={() => setStep(2)} 
                className="btn btn-outline" 
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 2 }}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Report;
