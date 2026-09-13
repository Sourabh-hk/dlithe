import React, { useState } from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import Modal from './Modal';
import { bookingService } from '../services/bookingService';
import toast from 'react-hot-toast';

const BookingModal = ({ isOpen, onClose, skill, onSuccess }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!skill) return null;

  // Preset time slots
  const commonSlots = [
    '09:00 AM - 10:00 AM',
    '10:30 AM - 11:30 AM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:00 PM - 07:00 PM',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      toast.error('Please select a session date');
      return;
    }
    if (!timeSlot) {
      toast.error('Please select or specify a time slot');
      return;
    }

    try {
      setLoading(true);
      const parts = timeSlot.split(' - ');
      const startTime = parts[0] || '10:00 AM';
      const endTime = parts[1] || '11:00 AM';

      await bookingService.createBooking({
        skillId: skill._id || skill.id,
        date,
        startTime,
        endTime,
        duration: 1,
        meetingNotes: message,
      });
      toast.success('Booking request sent successfully!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit booking request';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Min date today
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Learning Session">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
          <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-md)' }}>
            {skill.name || skill.title}
          </h4>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Mentor: <strong>{skill.mentor?.name || 'Instructor'}</strong> • Duration: {skill.duration || 60} mins • Price:{' '}
            <strong style={{ color: 'var(--color-primary)' }}>
              {(skill.price || skill.hourlyRate) > 0 ? `$${skill.price || skill.hourlyRate}` : 'Free'}
            </strong>
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="booking-date">
            Session Date *
          </label>
          <input
            id="booking-date"
            type="date"
            min={today}
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="booking-slot">
            Preferred Time Slot *
          </label>
          <select
            id="booking-slot"
            className="form-select"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          >
            <option value="">Select a time slot...</option>
            {commonSlots.map((slot, idx) => (
              <option key={idx} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <p className="form-hint">Choose an available hour for this session.</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="booking-message">
            Note / Learning Goals (optional)
          </label>
          <textarea
            id="booking-message"
            className="form-textarea"
            rows="3"
            placeholder="Introduce yourself and tell the mentor what you'd like to focus on during this session..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;
