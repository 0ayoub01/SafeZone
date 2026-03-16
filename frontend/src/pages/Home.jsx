import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="view page-bg-city">
      <div className="bg-overlay">
      {/* Hero Section */}
      <section className="container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center', 
        padding: '6rem 1rem',
        minHeight: '80vh',
        justifyContent: 'center'
      }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '0.5rem 1.2rem', 
          backgroundColor: 'var(--clr-primary-glow)', 
          color: 'var(--clr-primary)', 
          borderRadius: 'var(--radius-full)', 
          fontSize: '0.85rem', 
          fontWeight: '800', 
          marginBottom: '2rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          animation: 'fadeIn 0.8s ease'
        }}>
          🇹🇳 Empowering Tunisian Citizens
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          lineHeight: '1.1', 
          marginBottom: '1.5rem',
          maxWidth: '900px',
          background: 'linear-gradient(135deg, var(--clr-text-main) 0%, #444 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Make Your Neighborhood <br/>
          <span style={{ color: 'var(--clr-primary)', WebkitTextFillColor: 'initial' }}>Safer & Better.</span>
        </h1>
        
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--clr-text-muted)', 
          maxWidth: '700px', 
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          SafeZone is the modern way to report urban issues. From potholes to broken streetlights, we connect your voice to the community.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/report" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
            Report an Issue 🚀
          </Link>
          <Link to="/map" className="btn btn-outline" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
            View Interactive Map
          </Link>
        </div>

        {/* Floating Stats or Features */}
        <div style={{ 
          marginTop: '6rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem', 
          width: '100%' 
        }}>
          {[
            { title: 'Community Driven', desc: 'Powered by citizens like you who care about their surroundings.', icon: '🤝' },
            { title: 'Real-time Updates', desc: 'Track the status of your reports from submission to resolution.', icon: '⚡' },
            { title: 'Visual Mapping', desc: 'See reported issues on a live map of your city or neighborhood.', icon: '🗺️' }
          ].map((feature, i) => (
            <div key={i} className="card-premium" style={{ 
              textAlign: 'left', 
              padding: '2.5rem',
              animation: `slideUp ${0.8 + i * 0.2}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
              <h3 style={{ marginBottom: '0.8rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.95rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
};

export default Home;
