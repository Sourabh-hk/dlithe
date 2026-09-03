import { Link } from 'react-router-dom';

const SkillCard = ({ skill, showActions = false, onDelete }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ 
          display: 'inline-block', 
          backgroundColor: 'var(--bg-subtle)', 
          color: 'var(--primary-color)', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '1rem', 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          marginBottom: '0.5rem' 
        }}>
          {skill.category}
        </span>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>{skill.skillName}</h3>
        <p className="text-light" style={{ 
          fontSize: '0.875rem', 
          display: '-webkit-box', 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          {skill.description}
        </p>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="text-light">Experience:</span>
          <span style={{ fontWeight: '500' }}>{skill.experienceLevel}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="text-light">Availability:</span>
          <span style={{ fontWeight: '500' }}>{skill.availability}</span>
        </div>
      </div>

      {!showActions ? (
        <Link to={`/skills/${skill._id}`} className="btn btn-secondary" style={{ width: '100%' }}>
          View Details
        </Link>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/skills/${skill._id}`} className="btn btn-secondary" style={{ flex: 1 }}>View</Link>
          <Link to={`/skills/edit/${skill._id}`} className="btn btn-primary" style={{ flex: 1 }}>Edit</Link>
          <button onClick={() => onDelete(skill._id)} className="btn btn-danger" style={{ flex: 1 }}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default SkillCard;
