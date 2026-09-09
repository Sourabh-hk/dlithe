# Queue Management System

A full-stack, production-ready Queue Management System built with React, Node.js, Express, and MongoDB.

## Features
# Queue Management System
* **Operator Controls:** Create queues, call next tokens, pause/resume/close queues, view statistics.
* **User Portal:** View active queues, join queues, real-time tracking of token status and estimated wait time.
* **Professional UI:** Clean, responsive, enterprise-like interface.

## Technology Stack

* **Frontend:** React (Vite), React Router DOM, Axios, standard CSS
* **Backend:** Node.js, Express, Mongoose
* **Database:** MongoDB

## Folder Structure

```
queue-management-system/
├── backend/            # Express server & APIs
│   ├── config/         # DB Connection
│   ├── controllers/    # Route logic
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API routes
│   └── seed/           # DB Seeder
└── frontend/           # React App
    ├── src/
    │   ├── components/ # Reusable UI pieces
    │   ├── context/    # Global State (Toast)
    │   ├── layouts/    # App shell
    │   ├── pages/      # Route pages
    │   └── services/   # Axios API calls
```

## Prerequisites

* Node.js v16+
* MongoDB running locally (default: `mongodb://127.0.0.1:27017/queue-management`)

## Installation

1. Install dependencies for the backend:
```bash
cd backend
npm install
```

2. Install dependencies for the frontend:
```bash
cd ../frontend
npm install
```

3. Seed the database with sample queues:
```bash
cd ../backend
npm run seed
```

## Running the Application

**Start the Backend:**
```bash
cd backend
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```

## Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/queue-management
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Queues
* `GET /api/queues` - Get active/paused queues
* `GET /api/queues/completed` - Get completed queues
* `GET /api/queues/:id` - Get specific queue
* `POST /api/queues` - Create queue
* `PATCH /api/queues/:id/pause` - Pause queue
* `PATCH /api/queues/:id/resume` - Resume queue
* `PATCH /api/queues/:id/close` - Close queue
* `PATCH /api/queues/:id/reset` - Reset queue

### Tokens (Queue Actions)
* `POST /api/queues/:id/join` - Join queue (returns token)
* `PATCH /api/queues/:id/next` - Operator calls next token
* `DELETE /api/queues/:id/tokens/:tokenId` - Leave queue
* `GET /api/queues/:id/tokens/:tokenId` - Get real-time status of a user's token
