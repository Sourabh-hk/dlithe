# Resource Booking & Reservation System

A production-grade, full-stack web application for booking shared organizational resources — meeting rooms, labs, equipment, event halls, and more.

## Demo Accounts

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@example.com      | Admin@123  |
| User  | user@example.com       | User@123   |

## Features

- **Authentication** — JWT-based login/register with bcrypt password hashing
- **Role-Based Access** — USER and ADMIN roles, enforced on both frontend and backend
- **Resource Discovery** — Browse, search, and filter all resources
- **Availability Calendar** — React Big Calendar with day/week/month views and color-coded events
- **Multi-Step Booking** — Step-by-step form with live availability checking
- **Conflict Prevention** — Backend validates overlaps using `newStart < existingEnd AND newEnd > existingStart`
- **Booking Cancellation** — Cancel eligible bookings with confirmation dialog
- **Admin Dashboard** — Real stats from MongoDB (no fake data)
- **Admin Resource CRUD** — Create, edit, soft-delete resources
- **Admin Booking Management** — View, search, filter, cancel all bookings
- **Admin Calendar** — All bookings at a glance with filters
- **Admin User Management** — View/edit user roles and status

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router DOM, React Big Calendar, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

## Project Structure

```
resource-booking-system/
├── server/              # Backend (Node.js/Express)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   └── server.js
└── client/              # Frontend (React/Vite)
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── layouts/
        ├── pages/
        │   ├── auth/
        │   ├── user/
        │   └── admin/
        ├── routes/
        └── utils/
```

## Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally at `mongodb://127.0.0.1:27017`

### Backend

```bash
cd server
npm install
cp .env.example .env   # edit values as needed
npm run seed            # populate demo data
npm run dev             # start on port 5000
```

### Frontend

```bash
cd client
npm install
npm run dev             # start on port 5173
```

Open `http://localhost:5173` in your browser.

## Environment Variables

**Backend (`server/.env`)**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/resource-booking
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`)**
```
VITE_API_URL=http://localhost:5000/api
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/resources` | List all resources (search/filter) |
| GET | `/api/resources/:id` | Resource details |
| GET | `/api/resources/:id/availability` | Booking conflicts for a date |
| POST | `/api/bookings` | Create booking (conflict check) |
| GET | `/api/bookings/my` | Current user's bookings |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/POST | `/api/admin/resources` | Admin resource management |
| GET | `/api/admin/bookings` | All bookings (with search/filter) |
| GET | `/api/admin/users` | All users |

## Business Rules

1. Users cannot book a resource in the past
2. End time must be later than start time
3. No overlapping active bookings on the same resource
4. Cancelled bookings do not block future availability
5. Completed bookings cannot be cancelled by regular users
6. Users can only cancel their own bookings
7. Admin APIs reject non-admin users with 403 Forbidden
8. Maintenance/Inactive resources cannot be booked
9. Soft-deleting a resource preserves booking history
