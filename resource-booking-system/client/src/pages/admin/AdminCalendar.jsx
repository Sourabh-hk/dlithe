import { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { adminService, resourceService } from '../../api/services';
import { Card, Select, PageHeader } from '../../components/ui';
import { formatTime } from '../../utils/helpers';

const localizer = momentLocalizer(moment);

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({ resourceId: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAllResources().then((res) => setResources(res.data.data)).catch(console.error);
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.resourceId) params.resourceId = filters.resourceId;
      if (filters.status) params.status = filters.status;
      const res = await adminService.getCalendar(params);
      const mapped = res.data.data.map((b) => ({
        id: b._id,
        title: `${b.resource?.name} — ${b.user?.name}`,
        start: new Date(`${b.date}T${b.startTime}`),
        end: new Date(`${b.date}T${b.endTime}`),
        status: b.status,
        resource: b.resource,
        user: b.user,
      }));
      setEvents(mapped);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const eventStyleGetter = (event) => {
    const bg = event.status === 'COMPLETED' ? '#94a3b8' : '#3b82f6';
    return { style: { backgroundColor: bg, border: 'none', borderRadius: '3px', opacity: event.status === 'COMPLETED' ? 0.7 : 1 } };
  };

  return (
    <div className="p-6">
      <PageHeader title="Admin Calendar" subtitle="All resource bookings at a glance" />

      <div className="flex gap-3 mb-4">
        <div className="w-52">
          <Select value={filters.resourceId} onChange={(e) => setFilters({ ...filters, resourceId: e.target.value })}>
            <option value="">All Resources</option>
            {resources.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
          </Select>
        </div>
        <div className="w-36">
          <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
          </Select>
        </div>
      </div>

      <Card className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 620 }}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            defaultView="week"
            tooltipAccessor={(e) => e.title}
          />
        )}
      </Card>
    </div>
  );
};

export default AdminCalendar;
