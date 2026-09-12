import { format, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatTime = (time24) => {
  if (!time24) return '—';
  try {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  } catch {
    return time24;
  }
};

export const formatDateTime = (dateStr, startTime, endTime) => {
  return `${formatDate(dateStr)} · ${formatTime(startTime)} – ${formatTime(endTime)}`;
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const todayString = () => new Date().toISOString().split('T')[0];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
];

export const RESOURCE_TYPES = [
  'Meeting Room', 'Conference Room', 'Seminar Hall', 'Computer Lab',
  'Training Room', 'Event Hall', 'Projector', 'Camera',
  'Audio/Video Equipment', 'Workspace', 'Other',
];
