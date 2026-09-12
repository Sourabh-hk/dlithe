import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { resourceService } from '../../api/services';
import { Card, StatusBadge, Button, Skeleton } from '../../components/ui';
import { MapPin, Users, ArrowLeft, CalendarDays, CheckCircle, AlertTriangle } from 'lucide-react';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resourceService.getOne(id)
      .then((res) => setResource(res.data.data))
      .catch(() => navigate('/resources'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="p-6 max-w-4xl mx-auto">
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="grid lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );

  if (!resource) return null;

  const canBook = resource.status === 'AVAILABLE';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/resources" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Resources
      </Link>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: image + features */}
        <div className="lg:col-span-3 space-y-4">
          {resource.image ? (
            <div className="h-64 rounded-lg overflow-hidden bg-slate-100">
              <img src={resource.image} alt={resource.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-64 rounded-lg bg-slate-100 flex items-center justify-center">
              <CalendarDays className="w-12 h-12 text-slate-300" />
            </div>
          )}

          {resource.features?.length > 0 && (
            <Card className="p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Equipment & Facilities</h3>
              <div className="grid grid-cols-2 gap-2">
                {resource.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: info + booking */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{resource.name}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{resource.type}</p>
              </div>
              <StatusBadge status={resource.status} />
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />{resource.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="w-4 h-4 text-slate-400" />Capacity: {resource.capacity} {resource.capacity === 1 ? 'person' : 'people'}
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">{resource.description}</p>

            {canBook ? (
              <Link to={`/book/${resource._id}`}>
                <Button className="w-full" size="lg">
                  <CalendarDays className="w-4 h-4" />
                  Book this Resource
                </Button>
              </Link>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This resource is currently unavailable due to {resource.status === 'MAINTENANCE' ? 'maintenance' : 'being inactive'}.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
