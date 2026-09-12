import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../../api/services';
import { Card, StatusBadge, Button, Input, Select, Skeleton, EmptyState, PageHeader } from '../../components/ui';
import { RESOURCE_TYPES } from '../../utils/helpers';
import { Search, X, Users, MapPin, ChevronRight, SlidersHorizontal } from 'lucide-react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const ResourceCard = ({ resource }) => (
  <Card className="flex flex-col overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all">
    {resource.image && (
      <div className="h-40 overflow-hidden bg-slate-100">
        <img src={resource.image} alt={resource.name} className="w-full h-full object-cover" />
      </div>
    )}
    <div className="p-4 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{resource.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{resource.type}</p>
        </div>
        <StatusBadge status={resource.status} />
      </div>
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3 h-3" />{resource.location}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="w-3 h-3" />Capacity: {resource.capacity}
        </div>
      </div>
      {resource.features?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.features.slice(0, 4).map((f) => (
            <span key={f} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{f}</span>
          ))}
          {resource.features.length > 4 && (
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">+{resource.features.length - 4}</span>
          )}
        </div>
      )}
      <div className="mt-auto">
        <Link to={`/resources/${resource._id}`}>
          <Button variant="secondary" size="sm" className="w-full">
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  </Card>
);

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '' });
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 350);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      const res = await resourceService.getAll(params);
      setResources(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const clearFilters = () => {
    setSearch('');
    setFilters({ type: '', status: '' });
  };

  const hasFilters = search || filters.type || filters.status;

  return (
    <div className="p-6">
      <PageHeader
        title="Resources"
        subtitle="Browse and book available spaces and equipment"
      />

      {/* Search + Filter bar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources, locations, types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white hover:bg-slate-50 text-slate-700"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Select label="Type" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All Types</option>
            {RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </Select>
          <Select label="Availability" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="MAINTENANCE">Maintenance</option>
          </Select>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-72 rounded-lg" />)}
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No resources found"
          description="Try adjusting your search or filters."
          action={hasFilters && <Button variant="secondary" size="sm" onClick={clearFilters}>Clear filters</Button>}
        />
      ) : (
        <>
          <p className="text-xs text-slate-500 mb-4">{resources.length} resource{resources.length !== 1 ? 's' : ''} found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {resources.map((r) => <ResourceCard key={r._id} resource={r} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default Resources;
