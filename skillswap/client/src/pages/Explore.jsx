import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { skillService } from '../services/skillService';
import SkillCard from '../components/SkillCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import './Explore.css';

const CATEGORIES = [
  'All',
  'Web Development',
  'Programming',
  'Data Science',
  'Design',
  'Languages',
  'Career',
  'Photography',
  'Music',
  'Marketing',
  'Business',
  'Other',
];

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [pricing, setPricing] = useState('All'); // 'All', 'Free', 'Paid'
  const [sort, setSort] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL search query changes
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
    }
    const urlCat = searchParams.get('category');
    if (urlCat !== null && urlCat !== category) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.experienceLevel = level;
      if (pricing === 'Free') params.maxRate = 0;
      if (pricing === 'Paid') params.minRate = 1;
      if (sort) params.sort = sort;

      const res = await skillService.getSkills(params);
      setSkills(res.data.skills || res.data || []);
    } catch (err) {
      console.error('Failed to load skills', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [category, level, pricing, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
    setPricing('All');
    setSort('newest');
    setSearchParams({});
  };

  const hasActiveFilters = category !== 'All' || level !== 'All' || pricing !== 'All' || search.trim().length > 0;

  return (
    <div className="explore-page page">
      <div className="container">
        {/* Marketplace Header */}
        <div className="explore-header">
          <div>
            <h1 className="explore-title">Browse Mentorship Directory</h1>
            <p className="explore-subtitle">
              Find practitioners for 1-on-1 coaching, architecture reviews, and skill building.
            </p>
          </div>

          <button
            className="btn btn--outline hide-desktop"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>

        {/* Primary Filter Toolbar */}
        <div className="explore-toolbar">
          <form className="explore-search-box" onSubmit={handleSearchSubmit}>
            <Search className="explore-search-icon" size={16} />
            <input
              type="text"
              className="explore-search-input"
              placeholder="Search by topic, skill, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="explore-search-clear"
                onClick={() => {
                  setSearch('');
                  setSearchParams({});
                }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
            <button type="submit" className="btn btn--primary btn--sm">
              Search
            </button>
          </form>

          <div className="explore-sort-wrapper">
            <span className="text-xs text-tertiary">Sort:</span>
            <select
              className="form-select explore-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Recently added</option>
              <option value="rating">Highest rated</option>
              <option value="price_low">Rate: Low to High</option>
              <option value="price_high">Rate: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="explore-active-chips">
            <span className="text-xs text-tertiary">Active filters:</span>
            {search && (
              <button className="filter-chip" onClick={() => setSearch('')}>
                Query: "{search}" <X size={12} />
              </button>
            )}
            {category !== 'All' && (
              <button className="filter-chip" onClick={() => setCategory('All')}>
                Category: {category} <X size={12} />
              </button>
            )}
            {level !== 'All' && (
              <button className="filter-chip" onClick={() => setLevel('All')}>
                Level: {level} <X size={12} />
              </button>
            )}
            {pricing !== 'All' && (
              <button className="filter-chip" onClick={() => setPricing('All')}>
                Pricing: {pricing} <X size={12} />
              </button>
            )}
            <button className="btn btn--ghost btn--sm" onClick={handleClearFilters}>
              Reset all
            </button>
          </div>
        )}

        <div className="explore-layout">
          {/* Marketplace Sidebar */}
          <aside className={`explore-sidebar ${showMobileFilters ? 'explore-sidebar--open' : ''}`}>
            <div className="explore-sidebar__header hide-desktop">
              <span className="text-sm font-semibold">Filter Sessions</span>
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => setShowMobileFilters(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Category Filter */}
            <div className="explore-filter-section">
              <h4 className="explore-filter-label">Domain</h4>
              <div className="explore-filter-options">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`explore-filter-option ${category === cat ? 'explore-filter-option--active' : ''}`}
                    onClick={() => {
                      setCategory(cat);
                      setShowMobileFilters(false);
                    }}
                  >
                    <span>{cat}</span>
                    {category === cat && <span className="explore-filter-dot" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="explore-filter-section">
              <h4 className="explore-filter-label">Target Level</h4>
              <div className="explore-filter-options">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`explore-filter-option ${level === lvl ? 'explore-filter-option--active' : ''}`}
                    onClick={() => {
                      setLevel(lvl);
                      setShowMobileFilters(false);
                    }}
                  >
                    <span>{lvl}</span>
                    {level === lvl && <span className="explore-filter-dot" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Model */}
            <div className="explore-filter-section">
              <h4 className="explore-filter-label">Session Pricing</h4>
              <div className="explore-filter-options">
                {['All', 'Free', 'Paid'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`explore-filter-option ${pricing === p ? 'explore-filter-option--active' : ''}`}
                    onClick={() => {
                      setPricing(p);
                      setShowMobileFilters(false);
                    }}
                  >
                    <span>{p === 'All' ? 'All Sessions' : p === 'Free' ? 'Free Community Sessions' : 'Paid Mentorship'}</span>
                    {pricing === p && <span className="explore-filter-dot" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Column */}
          <main className="explore-results">
            <div className="explore-results__header">
              <span className="explore-results__count">
                <strong>{skills.length}</strong> {skills.length === 1 ? 'session' : 'sessions'} found
              </span>
            </div>

            {loading ? (
              <LoadingSkeleton count={6} type="card" />
            ) : skills.length > 0 ? (
              <div className="explore-grid">
                {skills.map((skill) => (
                  <SkillCard key={skill._id || skill.id} skill={skill} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Filter}
                title="No mentorship sessions match your filters"
                description="Try clearing some filter criteria or searching for broader terms like 'React', 'Design', or 'Python'."
                actionLabel="Reset All Filters"
                onAction={handleClearFilters}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Explore;
