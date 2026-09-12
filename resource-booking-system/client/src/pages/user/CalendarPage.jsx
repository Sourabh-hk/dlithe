import { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { bookingService, resourceService } from '../../api/services';
import { Card, Select, PageHeader } from '../../components/ui';
import { formatTime } from '../../utils/helpers';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resourceService.getAll().then((res) => setResources(res.data.data)).catch(console.error);
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = selectedResource ? { resourceId: selectedResource } : {};
      const res = await bookingService.getCalendar(params);
      const mapped = res.data.data.map((b) => {
        const start = new Date(`${b.date}T${b.startTime}`);
        const end = new Date(`${b.date}T${b.endTime}`);
        return {
          id: b._id,
          title: b.isOwn
            ? `${b.resource?.name} — ${b.purpose || 'My Booking'}`
            : `Reserved · ${formatTime(b.startTime)}–${formatTime(b.endTime)}`,
          start,
          end,
          isOwn: b.isOwn,
          status: b.status,
          resource: b.resource,
        };
      });
      setEvents(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedResource]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const eventStyleGetter = (event) => {
    let bg = '#64748b';
    if (event.status === 'COMPLETED') bg = '#94a3b8';
    else if (event.isOwn) bg = '#16a34a';
    else bg = '#3b82f6';
    return { style: { backgroundColor: bg, border: 'none', borderRadius: '3px', opacity: event.status === 'COMPLETED' ? 0.6 : 1 } };
  };

  return (
    <div className="p-6">
      <PageHeader title="Availability Calendar" subtitle="View resource bookings and availability" />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-64">
          <Select value={selectedResource} onChange={(e) => setSelectedResource(e.target.value)}>
            <option value="">All Resources</option>
            {resources.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
          </Select>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-600" />My Bookings</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500" />Others</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-400" />Completed</span>
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
            style={{ height: 600 }}
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

export default CalendarPage;
