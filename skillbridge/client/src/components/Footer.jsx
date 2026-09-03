const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', padding: '2rem 0', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>SkillBridge</h3>
        <p className="text-light" style={{ margin: 0 }}>Share What You Know. Learn What You Love.</p>
        <p className="text-light" style={{ margin: 0, fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
