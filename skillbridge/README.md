# SkillBridge

SkillBridge is a full-stack Skill Exchange & Learning Platform built with the MERN stack (MongoDB, Express, React, Node.js) and Vite.

## Features

- **Skill Discovery**: Browse and search skills offered by other users.
- **Filtering & Search**: Filter skills by category, experience level, and availability.
- **Offer Skills**: Create listings to offer your own skills.
- **Skill Management**: Edit or delete your skill listings.
- **Responsive UI**: A modern, clean, and practical design that looks great on all devices.

## Technologies Used

- **Frontend**: React (Vite), React Router DOM, Axios, Lucide React (icons)
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Architecture**: MVC pattern on the backend

## Installation Steps

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas connection string

### 1. Clone the repository
Navigate to the project root directory (`skillbridge`).

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (if not exists):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/skillbridge
```

To run the backend server (starts on port 5000):
```bash
npm run dev
```

*(Optional)* To seed the database with sample data:
```bash
node seeder.js
```

### 3. Frontend Setup
Open a new terminal window.
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (if not exists):
```env
VITE_API_URL=http://localhost:5000/api
```

To run the frontend app (starts on Vite's default port):
```bash
npm run dev
```

## API Endpoints

| Method | Endpoint          | Description            |
|--------|-------------------|------------------------|
| GET    | `/api/skills`     | Get all skills (supports search & filters) |
| GET    | `/api/skills/:id` | Get a specific skill   |
| POST   | `/api/skills`     | Create a new skill     |
| PUT    | `/api/skills/:id` | Update an existing skill|
| DELETE | `/api/skills/:id` | Delete a skill         |
