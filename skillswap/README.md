# SkillSwap — Peer-to-Peer Learning Marketplace

SkillSwap is a full-stack peer learning marketplace where individuals connect to exchange skills, book 1-on-1 mentorship sessions, and build verified reputations through peer ratings and reviews.

---

## 🌟 Key Features

### 1. User & Mentor Profiles
- **Role-based Experience:** Choose to learn, mentor, or both.
- **Public Mentor Profiles:** Display bio, professional headline, contact links, average rating, reviews, and all offered skills.
- **Profile Management:** Update bio, role, target learning interests, teaching offerings, location, and portfolio link.

### 2. Skill Listings & Marketplace
- **Search & Filter:** Keyword search by title/description, filter by categories (*Web Development, Programming, Design, Languages, Music, Business, etc.*), experience level (*Beginner, Intermediate, Advanced, All Levels*), and pricing (*Free / Paid*).
- **Sort Options:** Newest first, top-rated mentors, price low-to-high, price high-to-low.
- **Skill Detail Page:** Comprehensive view of curriculum, duration, pricing, mentor overview, and student reviews.

### 3. Session Booking Flow
- **1-on-1 Scheduling:** Interactive booking modal with date selection, preferred time slot, and learning objectives/notes.
- **Conflict Prevention:** Backend checks for double-booking conflicts on mentor schedules.
- **Self-Booking Protection:** Mentors cannot book their own sessions.

### 4. Booking & Session Management
- **Role-based Tab Views:** Manage sessions as a **Learner** (outgoing) or **Mentor** (incoming).
- **Status Lifecycle:** `pending` ➔ `accepted` / `rejected` ➔ `completed` / `cancelled`.
- **Learner Actions:** Cancel pending requests, mark completed sessions, and submit star ratings with comments.
- **Mentor Actions:** Accept or reject incoming requests with one click, mark sessions complete, and track earnings.

### 5. Ratings & Reviews
- **Verified Reviews:** Only learners who attended and completed a session can leave a review.
- **Aggregate Rating Engine:** Automatically updates mentor and skill average ratings and review counts on submission.
- **Reviews Dashboard:** View all feedback received and written.

### 6. Interactive Dashboard
- **Overview Metrics:** Sessions as learner, pending incoming requests, total completed sessions, and total earnings.
- **Quick Actions:** Create skills, browse marketplace, manage incoming requests.

---

## 🛠 Tech Stack

- **Frontend:**
  - React 18
  - Vite
  - React Router DOM v6
  - Axios (with centralized request & response interceptors)
  - Lucide React (feather-style icons)
  - React Hot Toast (toast notifications)
  - Custom Design System in CSS variables (clean typography, modern cards, responsive layout)

- **Backend:**
  - Node.js & Express.js
  - MongoDB & Mongoose
  - JSON Web Tokens (JWT) & bcryptjs for secure authentication
  - RESTful API architecture with centralized error handling

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally on `localhost:27017` or a MongoDB Atlas URI

### 1. Clone & Install Dependencies

From the `skillswap` project root:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Server (`server/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=skillswap_jwt_secret_key_2024
CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database

Populate the database with 10 sample mentors/learners, 15 rich skill listings, 10 bookings, and 5 verified reviews:

```bash
cd server
npm run seed
```

#### Demo Accounts
All seeded accounts use password: **`password123`**

| Name | Email | Primary Skill |
| :--- | :--- | :--- |
| **Ananya Sharma** | `ananya@example.com` | React Development, JavaScript |
| **Ravi Patel** | `ravi@example.com` | Node.js, MongoDB System Design |
| **Priya Menon** | `priya@example.com` | UI/UX Design & Figma Systems |
| **Arjun Reddy** | `arjun@example.com` | Python & Machine Learning |
| **Meera Krishnan** | `meera@example.com` | Photography & Lightroom |
| **Karthik Nair** | `karthik@example.com` | Guitar & Music Theory |
| **Sneha Gupta** | `sneha@example.com` | Digital Marketing & SEO |
| **Vikram Singh** | `vikram@example.com` | Career Coaching & Interview Prep |
| **Deepa Iyer** | `deepa@example.com` | Excel & Financial Modeling |
| **Rahul Joshi** | `rahul@example.com` | Data Structures & Algorithms |

### 4. Running Locally

**Terminal 1 — Start Backend Server:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Start Frontend Application:**
```bash
cd client
npm run dev
# Application opens at http://localhost:5173
```

---

## 📡 API Reference Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user & return JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user | Yes |
| `GET` | `/api/users/:id` | Get public user profile | No |
| `PUT` | `/api/users/profile` | Update profile information | Yes |
| `GET` | `/api/skills` | Search, filter & paginate skills | No |
| `GET` | `/api/skills/:id` | Fetch single skill with mentor details | No |
| `POST` | `/api/skills` | Create a new skill listing | Yes (Mentor) |
| `PUT` | `/api/skills/:id` | Update skill listing | Yes (Owner) |
| `DELETE`| `/api/skills/:id` | Remove skill listing | Yes (Owner) |
| `POST` | `/api/bookings` | Book a 1-on-1 session | Yes |
| `GET` | `/api/bookings/my` | Get user's outgoing bookings | Yes |
| `GET` | `/api/bookings/incoming`| Get mentor's incoming requests | Yes (Mentor) |
| `PATCH` | `/api/bookings/:id/status` | Update booking status (`accepted`, `rejected`, `completed`, `cancelled`) | Yes |
| `POST` | `/api/reviews` | Review a completed session | Yes (Learner) |
| `GET` | `/api/reviews/mentor/:id` | Get reviews for a mentor | No |
| `GET` | `/api/reviews/my` | Get reviews written by user | Yes |

---

## 📂 Project Structure

```
skillswap/
├── package.json               # Root scripts
├── README.md                  # Documentation
├── server/
│   ├── config/db.js           # Mongoose connection
│   ├── controllers/           # Auth, User, Skill, Booking, Review controllers
│   ├── middleware/            # JWT auth & error handler middleware
│   ├── models/                # User, Skill, Booking, Review schemas
│   ├── routes/                # Express API routes
│   ├── utils/generateToken.js # JWT generator
│   ├── seed.js                # Database seeder with realistic test data
│   └── server.js              # Express app entrypoint
└── client/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── components/        # Navbar, Footer, Modal, Cards, Badges, etc.
        ├── context/           # AuthContext
        ├── pages/             # Landing, Explore, SkillDetail, Dashboard, Bookings, etc.
        ├── services/          # Axios API abstraction services
        ├── index.css          # Design system & tokens
        └── main.jsx           # App entrypoint
```
