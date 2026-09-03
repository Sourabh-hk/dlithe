import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SkillContext } from '../context/SkillContext';
import SkillCard from '../components/SkillCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Search, Filter, X } from 'lucide-react';

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Graphic Design', 
  'Photography', 'Music', 'Languages', 'Digital Marketing', 
  'Data Science', 'Fitness', 'Cooking', 'Other'
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const AVAILABILITIES = ['Weekdays', 'Weekends', 'Morning', 'Afternoon', 'Evening', 'Flexible'];

const ExploreSkills = () => {
  const { skills, loading, error, fetchSkills } = useContext(SkillContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    availability: searchParams.get('availability') || ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchSkills(searchTerm, filters.category, filters.experienceLevel, filters.availability);
  }, [fetchSkills, searchTerm, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ category: '', experienceLevel: '', availability: '' });
    setSearchParams({});
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filters.category) params.set('category', filters.category);
    if (filters.experienceLevel) params.set('experienceLevel', filters.experienceLevel);
    if (filters.availability) params.set('availability', filters.availability);
    setSearchParams(params);
  };

  // Run updateURL when filters change
  useEffect(() => {
    updateURL();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Explore Skills</h1>
        <p className="text-light">Discover skills offered by our community members.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={20} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search skills by name or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-secondary" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter size={20} /> <span style={{ marginLeft: '0.5rem' }}>Filters</span>
          </button>
        </form>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', backgroundColor: 'var(--bg-subtle)' }}>
            <div>
              <label className="form-label">Category</label>
              <select className="form-control" name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Experience Level</label>
              <select className="form-control" name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange}>
                <option value="">All Levels</option>
                {EXPERIENCE_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Availability</label>
              <select className="form-control" name="availability" value={filters.availability} onChange={handleFilterChange}>
                <option value="">Any Time</option>
                {AVAILABILITIES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="button" onClick={clearFilters} className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <X size={18} /> Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          {loading && <Loading message="Loading skills..." />}
          {error && <ErrorMessage message={error} onRetry={() => fetchSkills(searchTerm, filters.category, filters.experienceLevel, filters.availability)} />}
          
          {!loading && !error && (
            <>
              <p className="text-light" style={{ marginBottom: '1.5rem' }}>Found {skills.length} skills</p>
              
              {skills.length > 0 ? (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {skills.map(skill => (
                    <SkillCard key={skill._id} skill={skill} />
                  ))}
                </div>
              ) : (
                <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                  <Search size={48} color="var(--border-color)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3>No skills found</h3>
                  <p className="text-light">Try changing your search or clearing the filters.</p>
                  <button onClick={clearFilters} className="btn btn-primary mt-4">Clear All Filters</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreSkills;
