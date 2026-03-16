const About = () => {
  return (
    <div className="view container" style={{ maxWidth: '800px' }}>
      <div className="hero" style={{ textAlign: 'left', padding: '3rem', backgroundColor: 'var(--clr-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ color: 'var(--clr-primary)', marginBottom: '1.5rem', fontSize: '2rem' }}>About SafeZone</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: '1.8' }}>
          SafeZone was created to bridge the communication gap between the citizens of Tunisia and local authorities. By providing an easy-to-use platform, we empower individuals to report local urban problems quickly and efficiently.
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: '1.8' }}>
          Features include real-time location tagging, photo uploads, and community upvoting to help prioritize the most pressing issues in each neighborhood.
        </p>
        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Tech Stack</h3>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
          <li><strong>MongoDB:</strong> NoSQL database for flexible data storage.</li>
          <li><strong>Express.js & Node.js:</strong> Robust backend API framework.</li>
          <li><strong>React & Vite:</strong> Fast, modern frontend Single Page Application.</li>
          <li><strong>Leaflet:</strong> Open source interactive maps.</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
