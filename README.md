# FarmRent 🌾

> A platform for farmers to share and rent agricultural tools locally.

## Description

FarmRent connects farmers with neighbours who own tractors, harvesters, pumps, sprayers, and other equipment. Instead of purchasing expensive machinery, farmers can rent what they need for just the days they need it — reducing costs and increasing access across rural communities.

## Features

- 🔐 **JWT Authentication** — Secure login and registration with bcrypt password hashing
- 🚜 **Equipment Listings** — Browse, filter by district/village/type, and search for farm tools
- 📅 **Availability Calendar** — Visual calendar showing available and booked dates
- 📬 **Booking System** — Send booking requests; owners confirm or decline
- ⭐ **Reviews** — Leave ratings and comments after using equipment
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- 🌾 **Demo Mode** — Frontend works with demo data even when backend is offline

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB with Mongoose ODM               |
| Auth      | JSON Web Tokens (JWT) + bcryptjs        |
| Security  | Helmet.js, CORS                         |
| Frontend  | Plain HTML5, CSS3, Vanilla JavaScript   |

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

## Setup & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-org/Farm-Rent-project.git
cd Farm-Rent-project

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET

# 4. Start the server
node server.js

# 5. Open in browser
# http://localhost:3000
```

The server serves the frontend static files and the API from the same port.

## Environment Variables

| Variable      | Default                                    | Description                    |
|---------------|--------------------------------------------|--------------------------------|
| `MONGODB_URI` | `mongodb://localhost:27017/farmrent`       | MongoDB connection string      |
| `JWT_SECRET`  | `your_super_secret_jwt_key_...`            | Secret key for signing JWTs    |
| `PORT`        | `3000`                                     | Port for the Express server    |

## API Endpoints

### Auth
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/api/auth/register`  | Register a new farmer    |
| POST   | `/api/auth/login`     | Login and receive JWT    |

### Equipment
| Method | Endpoint                          | Description                          |
|--------|-----------------------------------|--------------------------------------|
| GET    | `/api/equipment`                  | List all equipment (filterable)      |
| POST   | `/api/equipment`                  | Create listing (auth required)       |
| GET    | `/api/equipment/:id`              | Get single equipment details         |
| PUT    | `/api/equipment/:id`              | Update listing (owner only)          |
| DELETE | `/api/equipment/:id`              | Delete listing (owner only)          |
| POST   | `/api/equipment/:id/availability` | Set available dates (owner only)     |

### Bookings
| Method | Endpoint                       | Description                           |
|--------|--------------------------------|---------------------------------------|
| POST   | `/api/bookings`                | Create a booking request (auth)       |
| GET    | `/api/bookings/my`             | Get my bookings (auth)                |
| GET    | `/api/bookings/equipment/:id`  | Get bookings for equipment (owner)    |
| PUT    | `/api/bookings/:id/status`     | Update booking status (auth)          |

### Reviews
| Method | Endpoint                      | Description                        |
|--------|-------------------------------|------------------------------------|
| POST   | `/api/reviews`                | Submit a review (auth required)    |
| GET    | `/api/reviews/equipment/:id`  | Get reviews for equipment          |

## Project Structure

```
Farm-Rent-project/
├── backend/
│   ├── server.js               # Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   ├── Farmer.js           # User model
│   │   ├── Equipment.js        # Equipment listing model
│   │   ├── Booking.js          # Booking request model
│   │   └── Review.js           # Review model
│   ├── routes/
│   │   ├── auth.js             # Register & login routes
│   │   ├── equipment.js        # Equipment CRUD routes
│   │   ├── bookings.js         # Booking routes
│   │   └── reviews.js          # Review routes
│   └── middleware/
│       └── auth.js             # JWT verification middleware
└── frontend/
    ├── index.html              # Landing page
    ├── listings.html           # Equipment browse page
    ├── add-equipment.html      # Add equipment form
    ├── booking.html            # Booking & equipment detail page
    ├── login.html              # Login / Register page
    ├── profile.html            # User profile & dashboard
    ├── css/
    │   └── style.css           # Full responsive stylesheet
    └── js/
        ├── main.js             # Shared utilities, auth, demo data
        ├── listings.js         # Listings page logic
        ├── booking.js          # Booking page logic
        └── calendar.js         # CalendarWidget class
```

## License

MIT © 2024 FarmRent
