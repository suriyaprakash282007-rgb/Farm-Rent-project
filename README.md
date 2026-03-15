# 🚜 FarmRent — Agricultural Equipment Rental Platform

FarmRent is a web platform that allows farmers to **share or rent agricultural tools and machinery** with nearby farmers. Expensive machines like tractors, harvesters, seeders, and water pumps can be listed for rent, enabling small farmers to access equipment affordably.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📅 **Availability Calendar** | Owners set available/unavailable dates; renters view and book |
| 🔍 **Nearby Search** | Search equipment by village, district, category, price |
| 📞 **Booking System** | Request bookings with date range and message; owners confirm/reject |
| 📷 **Equipment Listing** | Upload photos, price per day, location, contact details |
| ⭐ **Farmer Rating System** | Rate equipment owners after completed rentals |
| 🔔 **Notification System** | In-app alerts for booking requests, confirmations, and reviews |
| 🔐 **JWT Authentication** | Secure login with bcrypt password hashing |

---

## 🏗️ Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router v6** — client-side routing
- **Axios** — API communication
- **react-calendar** — Availability calendar
- **react-hot-toast** — Notifications
- **react-icons** — Icon library

### Backend
- **Node.js + Express.js** — REST API
- **MongoDB + Mongoose** — Database
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **Helmet.js** — Security headers
- **Multer** — File upload handling
- **express-validator** — Input validation

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone the repository
```bash
git clone https://github.com/suriyaprakash282007-rgb/Farm-Rent-project.git
cd Farm-Rent-project
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env        # Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev                 # Starts on http://localhost:5000
```

**Environment variables** (`.env`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/farmrent
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev                 # Starts on http://localhost:5173
```

---

## 📁 Project Structure

```
Farm-Rent-project/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile, notifications
│   │   ├── equipmentController.js  # Equipment CRUD, search, availability
│   │   ├── bookingController.js    # Booking requests, status management
│   │   └── reviewController.js    # Equipment ratings and reviews
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── errorHandler.js     # Global error handling
│   │   └── upload.js           # Multer file upload
│   ├── models/
│   │   ├── User.js             # Farmer model (with geolocation, notifications)
│   │   ├── Equipment.js        # Equipment listing model
│   │   ├── Booking.js          # Booking model
│   │   └── Review.js           # Review/rating model
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── equipment.js        # /api/equipment/*
│   │   ├── bookings.js         # /api/bookings/*
│   │   └── reviews.js          # /api/reviews/*
│   ├── utils/
│   │   └── notification.js     # In-app notification utility
│   ├── __tests__/
│   │   └── api.test.js         # Backend API tests (Jest + Supertest)
│   ├── server.js               # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/         # Navbar, Footer
    │   │   ├── equipment/      # EquipmentCard, AvailabilityCalendar
    │   │   ├── booking/        # BookingForm
    │   │   └── common/         # StarRating
    │   ├── context/
    │   │   └── AuthContext.jsx # Global auth state
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── EquipmentListPage.jsx
    │   │   ├── EquipmentDetailPage.jsx
    │   │   ├── EquipmentFormPage.jsx
    │   │   ├── BookingsPage.jsx
    │   │   ├── MyListingsPage.jsx
    │   │   ├── NotificationsPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── utils/
    │   │   └── api.js          # Axios instance with JWT interceptor
    │   └── __tests__/
    │       └── components.test.jsx  # Frontend component tests (Vitest)
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register farmer |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update profile |
| GET | `/api/auth/notifications` | Yes | Get notifications |
| PUT | `/api/auth/notifications/:id/read` | Yes | Mark notification read |
| GET | `/api/equipment` | No | List/search equipment |
| GET | `/api/equipment/my-listings` | Yes | Get owner's listings |
| GET | `/api/equipment/:id` | No | Get equipment details |
| POST | `/api/equipment` | Yes | Create listing |
| PUT | `/api/equipment/:id` | Yes | Update listing |
| DELETE | `/api/equipment/:id` | Yes | Remove listing |
| PUT | `/api/equipment/:id/availability` | Yes | Update availability calendar |
| GET | `/api/bookings` | Yes | Get user bookings |
| POST | `/api/bookings` | Yes | Create booking request |
| GET | `/api/bookings/:id` | Yes | Get booking details |
| PUT | `/api/bookings/:id/status` | Yes | Update booking status |
| GET | `/api/reviews/equipment/:id` | No | Get equipment reviews |
| POST | `/api/reviews` | Yes | Create review |

---

## 🧪 Running Tests

**Backend tests:**
```bash
cd backend && npm test
```

**Frontend tests:**
```bash
cd frontend && npm test
```

---

## 🔐 Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens for stateless authentication
- **Helmet.js** sets secure HTTP headers
- **CORS** restricted to frontend origin
- Input validation via **express-validator**
- File uploads limited to images (5MB max)

---

## ☁️ Deployment

- **Frontend**: Deploy `frontend/dist` to Netlify / Vercel
- **Backend**: Deploy to AWS EC2 / Railway / Render
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting

---

## 🌾 About FarmRent

> FarmRent focuses on **village-level equipment sharing**, helping small farmers reduce machinery costs and encouraging community cooperation. It increases efficient use of farm tools within local agricultural ecosystems.
