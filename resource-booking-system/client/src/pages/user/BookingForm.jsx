import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourceService, bookingService } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button, Card, Select, Textarea, Skeleton } from '../../components/ui';
import { formatDate, formatTime, todayString, TIME_SLOTS } from '../../utils/helpers';
import { CalendarDays, Clock, Users, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

const STEPS = ['Resource & Date', 'Time', 'Details', 'Review'];

const BookingForm = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [resource, setResource] = useState(null);
  const [loadingResource, setLoadingResource] = useState(true);
  const [existingBookings, setExistingBookings] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    date: todayString(),
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    resourceService.getOne(resourceId)
      .then((res) => setResource(res.data.data))
      .catch(() => navigate('/resources'))
      .finally(() => setLoadingResource(false));
  }, [resourceId]);

  // Fetch availability when date changes
  useEffect(() => {
    if (form.date && resource) {
      setCheckingAvailability(true);
      resourceService.getAvailability(resourceId, form.date)
        .then((res) => setExistingBookings(res.data.data.bookings || []))
        .catch(() => setExistingBookings([]))
        .finally(() => setCheckingAvailability(false));
    }
  }, [form.date, resourceId, resource]);

  const isSlotConflict = (start, end) => {
    return existingBookings.some((b) => start < b.endTime && end > b.startTime);
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.date) e.date = 'Date is required';
      else if (form.date < todayString()) e.date = 'Cannot select a past date';
    }
    if (step === 1) {
      if (!form.startTime) e.startTime = 'Start time is required';
      if (!form.endTime) e.endTime = 'End time is required';
      else if (form.endTime <= form.startTime) e.endTime = 'End time must be after start time';
      else if (form.startTime && form.endTime && isSlotConflict(form.startTime, form.endTime)) {
        e.startTime = 'This time slot conflicts with an existing booking';
      }
    }
    if (step === 2) {
      if (!form.purpose.trim()) e.purpose = 'Purpose is required';
      if (form.attendees < 1) e.attendees = 'At least 1 attendee required';
      if (resource && form.attendees > resource.capacity) e.attendees = `Exceeds capacity of ${resource.capacity}`;
    }
    return e;
  };

  const next = () => {
    const e = validateStep();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await bookingService.create({
        resource: resourceId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose,
        attendees: Number(form.attendees),
      });
      toast.success('Booking confirmed!');
      navigate(`/my-bookings/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking. Please try again.');
      if (err.response?.status === 409) setStep(1); // Go back to time selection
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingResource) return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
  if (!resource) return null;

  const availableSlots = TIME_SLOTS.filter((slot, idx) => {
    if (idx === TIME_SLOTS.length - 1) return false;
    const end = TIME_SLOTS[idx + 1];
    return !isSlotConflict(slot, end);
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold text-slate-900 mb-1">Book a Resource</h1>
      <p className="text-sm text-slate-500 mb-6">{resource.name} · {resource.location}</p>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
              i < step ? 'bg-blue-600 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`ml-2 text-xs font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-slate-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`mx-3 h-px w-8 sm:w-12 ${i < step ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {/* Step 0: Date */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Select Date</h2>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                min={todayString()}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value, startTime: '', endTime: '' })}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-400' : 'border-slate-300'}`}
              />
              {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
            </div>
          </div>
        )}

        {/* Step 1: Time */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-1">Select Time for {formatDate(form.date)}</h2>

            {checkingAvailability ? (
              <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Checking availability...
              </div>
            ) : (
              <>
                {existingBookings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Reserved times:</p>
                    {existingBookings.map((b, i) => (
                      <p key={i} className="text-xs text-amber-700">{formatTime(b.startTime)} – {formatTime(b.endTime)}</p>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Start Time</label>
                    <select
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value, endTime: '' })}
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startTime ? 'border-red-400' : 'border-slate-300'}`}
                    >
                      <option value="">Select start</option>
                      {TIME_SLOTS.slice(0, -1).map((t) => (
                        <option key={t} value={t} disabled={isSlotConflict(t, TIME_SLOTS[TIME_SLOTS.indexOf(t) + 1])}>
                          {formatTime(t)} {isSlotConflict(t, TIME_SLOTS[TIME_SLOTS.indexOf(t) + 1]) ? '(Reserved)' : ''}
                        </option>
                      ))}
                    </select>
                    {errors.startTime && <p className="text-xs text-red-600">{errors.startTime}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">End Time</label>
                    <select
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      disabled={!form.startTime}
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400 ${errors.endTime ? 'border-red-400' : 'border-slate-300'}`}
                    >
                      <option value="">Select end</option>
                      {TIME_SLOTS.filter((t) => t > form.startTime).map((t) => (
                        <option key={t} value={t} disabled={isSlotConflict(form.startTime, t)}>
                          {formatTime(t)} {isSlotConflict(form.startTime, t) ? '(Conflict)' : ''}
                        </option>
                      ))}
                    </select>
                    {errors.endTime && <p className="text-xs text-red-600">{errors.endTime}</p>}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Booking Details</h2>
            <Textarea
              label="Purpose *"
              placeholder="e.g. Q4 planning session, client presentation..."
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              error={errors.purpose}
              rows={3}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Number of Attendees *</label>
              <input
                type="number"
                min={1}
                max={resource.capacity}
                value={form.attendees}
                onChange={(e) => setForm({ ...form, attendees: e.target.value })}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.attendees ? 'border-red-400' : 'border-slate-300'}`}
              />
              <p className="text-xs text-slate-400">Maximum capacity: {resource.capacity}</p>
              {errors.attendees && <p className="text-xs text-red-600">{errors.attendees}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Review Booking</h2>
            <div className="space-y-3">
              {[
                { label: 'Resource', value: resource.name },
                { label: 'Location', value: resource.location },
                { label: 'Date', value: formatDate(form.date) },
                { label: 'Time', value: `${formatTime(form.startTime)} – ${formatTime(form.endTime)}` },
                { label: 'Purpose', value: form.purpose },
                { label: 'Attendees', value: form.attendees },
                { label: 'Booked by', value: user?.name },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-4 pb-3 border-b border-slate-100 last:border-0">
                  <span className="text-xs font-medium text-slate-500 w-24 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-sm text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
          {step > 0 ? (
            <Button variant="secondary" onClick={back}>Back</Button>
          ) : <div />}
          {step < 3 ? (
            <Button onClick={next}>
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting}>
              Confirm Booking
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BookingForm;
