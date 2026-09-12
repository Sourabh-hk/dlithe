const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resource-booking');
  console.log('MongoDB Connected for seeding...');
};

const users = [
  { name: 'Admin User', email: 'admin@example.com', phone: '9800000001', password: 'Admin@123', role: 'ADMIN' },
  { name: 'Sourabh Kulkarni', email: 'user@example.com', phone: '9800000002', password: 'User@123', role: 'USER' },
  { name: 'Priya Sharma', email: 'priya@example.com', phone: '9800000003', password: 'User@123', role: 'USER' },
  { name: 'Rahul Verma', email: 'rahul@example.com', phone: '9800000004', password: 'User@123', role: 'USER' },
  { name: 'Ananya Iyer', email: 'ananya@example.com', phone: '9800000005', password: 'User@123', role: 'USER' },
  { name: 'Kiran Patil', email: 'kiran@example.com', phone: '9800000006', password: 'User@123', role: 'USER' },
];

const resources = [
  {
    name: 'Conference Room A',
    type: 'Conference Room',
    description: 'A premium conference room with state-of-the-art AV equipment, ideal for client presentations, board meetings, and team strategy sessions.',
    location: 'Building 1 · Floor 3',
    capacity: 20,
    features: ['Projector', 'Whiteboard', 'Video Conferencing', 'Wi-Fi', 'AC'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'Conference Room B',
    type: 'Conference Room',
    description: 'Mid-sized conference room suited for team meetings, product reviews, and departmental discussions.',
    location: 'Building 1 · Floor 2',
    capacity: 12,
    features: ['Projector', 'Whiteboard', 'Wi-Fi', 'AC'],
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'Innovation Lab',
    type: 'Workspace',
    description: 'An open, collaborative workspace designed for brainstorming, design thinking workshops, and creative team sessions.',
    location: 'Building 2 · Floor 1',
    capacity: 30,
    features: ['Whiteboards', 'Sticky Boards', 'Wi-Fi', 'Standing Desks', 'AC'],
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'Computer Lab 1',
    type: 'Computer Lab',
    description: 'Fully equipped computer lab with 40 workstations, suitable for training sessions, coding workshops, and certifications.',
    location: 'Building 3 · Floor 2',
    capacity: 40,
    features: ['40 Workstations', 'High-speed Internet', 'Projector', 'Printer', 'AC'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'Seminar Hall',
    type: 'Seminar Hall',
    description: 'A large seminar hall with auditorium-style seating, suitable for company-wide presentations, guest lectures, and orientations.',
    location: 'Building 1 · Ground Floor',
    capacity: 150,
    features: ['Stage', 'Podium', 'Microphone', 'Projector Screen', 'Sound System', 'AC'],
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'Projector 01',
    type: 'Projector',
    description: 'High-definition portable projector with HDMI and wireless connectivity. Includes carrying case and remote.',
    location: 'Equipment Store · Room 101',
    capacity: 1,
    features: ['Full HD', 'HDMI', 'Wireless', 'Remote Control'],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'DSLR Camera Kit',
    type: 'Camera',
    description: 'Professional DSLR camera kit including lenses, tripod, and memory cards. Suitable for events, interviews, and documentation.',
    location: 'Equipment Store · Room 101',
    capacity: 1,
    features: ['24MP DSLR', 'Multiple Lenses', 'Tripod', '64GB Memory Card'],
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'Training Room',
    type: 'Training Room',
    description: 'Dedicated training room with classroom-style seating, suitable for onboarding sessions, skill workshops, and certification programs.',
    location: 'Building 2 · Floor 2',
    capacity: 25,
    features: ['Projector', 'Whiteboard', 'Wi-Fi', 'Flip Charts', 'AC'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'Event Hall',
    type: 'Event Hall',
    description: 'Large multi-purpose event hall suitable for town halls, product launches, hackathons, and large team events.',
    location: 'Building 4 · Ground Floor',
    capacity: 200,
    features: ['Stage', 'Sound System', 'Projector', 'Wi-Fi', 'Catering Area', 'AC'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'Meeting Room C',
    type: 'Meeting Room',
    description: 'Small, quiet meeting room ideal for one-on-ones, interviews, and focused discussions.',
    location: 'Building 1 · Floor 1',
    capacity: 6,
    features: ['Display Screen', 'Wi-Fi', 'Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    status: 'AVAILABLE',
  },
  {
    name: 'Audio/Video Suite',
    type: 'Audio/Video Equipment',
    description: 'Professional audio/video recording suite with podcast microphones, ring lights, and green screen. Great for content creation.',
    location: 'Building 2 · Floor 3',
    capacity: 4,
    features: ['Podcast Mics', 'Ring Light', 'Green Screen', 'Audio Mixer'],
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80',
    status: 'MAINTENANCE',
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear collections
    await User.deleteMany();
    await Resource.deleteMany();
    await Booking.deleteMany();
    console.log('Cleared existing data');

    // Seed users — hash passwords manually since insertMany bypasses pre-save hooks
    const hashedUsers = await Promise.all(
      users.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 12) }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);

    const createdResources = await Resource.create(resources);
    console.log(`Created ${createdResources.length} resources`);

    // Get references
    const adminUser = createdUsers.find((u) => u.role === 'ADMIN');
    const user1 = createdUsers.find((u) => u.email === 'user@example.com');
    const user2 = createdUsers.find((u) => u.email === 'priya@example.com');
    const user3 = createdUsers.find((u) => u.email === 'rahul@example.com');

    const confRoomA = createdResources.find((r) => r.name === 'Conference Room A');
    const confRoomB = createdResources.find((r) => r.name === 'Conference Room B');
    const innovLab = createdResources.find((r) => r.name === 'Innovation Lab');
    const compLab = createdResources.find((r) => r.name === 'Computer Lab 1');
    const trainingRoom = createdResources.find((r) => r.name === 'Training Room');

    // Calculate future and past dates
    const today = new Date();
    const fmt = (d) => d.toISOString().split('T')[0];
    const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
    const subDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() - n); return x; };

    const bookings = [
      // CONFIRMED (upcoming) — no overlaps
      { bookingRef: 'BK-00001', resource: confRoomA._id, user: user1._id, date: fmt(addDays(today, 1)), startTime: '09:00', endTime: '10:30', purpose: 'Q4 Planning Session', attendees: 12, status: 'CONFIRMED' },
      { bookingRef: 'BK-00002', resource: confRoomA._id, user: user2._id, date: fmt(addDays(today, 1)), startTime: '11:00', endTime: '12:00', purpose: 'Design Review', attendees: 6, status: 'CONFIRMED' },
      { bookingRef: 'BK-00003', resource: confRoomB._id, user: user3._id, date: fmt(addDays(today, 2)), startTime: '14:00', endTime: '15:30', purpose: 'Sprint Retrospective', attendees: 8, status: 'CONFIRMED' },
      { bookingRef: 'BK-00004', resource: innovLab._id, user: user1._id, date: fmt(addDays(today, 3)), startTime: '10:00', endTime: '13:00', purpose: 'Design Thinking Workshop', attendees: 20, status: 'CONFIRMED' },
      { bookingRef: 'BK-00005', resource: trainingRoom._id, user: adminUser._id, date: fmt(addDays(today, 5)), startTime: '09:30', endTime: '12:30', purpose: 'New Employee Orientation', attendees: 15, status: 'CONFIRMED' },
      // COMPLETED (past)
      { bookingRef: 'BK-00006', resource: confRoomA._id, user: user1._id, date: fmt(subDays(today, 3)), startTime: '10:00', endTime: '11:00', purpose: 'Project Kickoff', attendees: 10, status: 'COMPLETED' },
      { bookingRef: 'BK-00007', resource: confRoomB._id, user: user2._id, date: fmt(subDays(today, 5)), startTime: '14:00', endTime: '15:00', purpose: 'Client Call', attendees: 4, status: 'COMPLETED' },
      { bookingRef: 'BK-00008', resource: compLab._id, user: user3._id, date: fmt(subDays(today, 7)), startTime: '09:00', endTime: '17:00', purpose: 'React Training', attendees: 35, status: 'COMPLETED' },
      // CANCELLED
      { bookingRef: 'BK-00009', resource: confRoomA._id, user: user3._id, date: fmt(addDays(today, 4)), startTime: '15:00', endTime: '16:00', purpose: 'Cancelled Meeting', attendees: 5, status: 'CANCELLED' },
      { bookingRef: 'BK-00010', resource: innovLab._id, user: user2._id, date: fmt(subDays(today, 2)), startTime: '10:00', endTime: '12:00', purpose: 'Cancelled Workshop', attendees: 10, status: 'CANCELLED' },
    ];

    await Booking.create(bookings);
    console.log(`Created ${bookings.length} sample bookings`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nDemo Accounts:');
    console.log('  Admin: admin@example.com / Admin@123');
    console.log('  User:  user@example.com / User@123\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
