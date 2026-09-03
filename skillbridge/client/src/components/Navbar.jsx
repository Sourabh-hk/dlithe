import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  return (
    <header style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-color)', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <BookOpen color="var(--primary-color)" />
          SkillBridge
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-color)', fontWeight: '500' }}>Home</Link>
          <Link to="/skills" style={{ color: 'var(--text-color)', fontWeight: '500' }}>Explore Skills</Link>
          <Link to="/my-skills" style={{ color: 'var(--text-color)', fontWeight: '500' }}>My Skills</Link>
          <Link to="/add-skill" className="btn btn-primary">Offer a Skill</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
