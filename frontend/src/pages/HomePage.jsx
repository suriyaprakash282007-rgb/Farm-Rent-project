import React from 'react';
import { Link } from 'react-router-dom';
import { FaTractor, FaSearch, FaCalendarAlt, FaPhone, FaStar, FaBell } from 'react-icons/fa';
import { GiWheat, GiWaterTower, GiSeedling } from 'react-icons/gi';
import './HomePage.css';

const features = [
  { icon: <FaCalendarAlt />, title: 'Availability Calendar', desc: 'See exactly when equipment is available and book your preferred dates instantly.' },
  { icon: <FaSearch />, title: 'Nearby Search', desc: 'Find farm equipment available in your village, district, or nearby areas.' },
  { icon: <FaPhone />, title: 'Direct Contact', desc: 'Contact owners directly via phone or WhatsApp to confirm bookings.' },
  { icon: <FaStar />, title: 'Farmer Ratings', desc: 'Trusted reviews from real farmers ensure quality equipment and reliable service.' },
  { icon: <FaBell />, title: 'Instant Alerts', desc: 'Get notified immediately when someone requests to rent your equipment.' },
  { icon: <GiSeedling />, title: 'Village Network', desc: 'Designed for local communities — connecting farmers at the village level.' },
];

const categories = [
  { name: 'Tractor', icon: <FaTractor />, color: '#2d7a3a' },
  { name: 'Harvester', icon: <GiWheat />, color: '#f57c00' },
  { name: 'Water Pump', icon: <GiWaterTower />, color: '#00838f' },
  { name: 'Seeder', icon: <GiSeedling />, color: '#1565c0' },
  { name: 'Plough', icon: <FaTractor />, color: '#6a1b9a' },
  { name: 'Sprayer', icon: <FaTractor />, color: '#00695c' },
];

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">🌾 For Farmers, By Farmers</span>
            <h1>
              Rent Farm Equipment<br />
              <span className="hero-accent">Near You, Today</span>
            </h1>
            <p>
              FarmRent connects farmers who need machinery with those who own it.
              Find tractors, harvesters, water pumps and more — right in your village.
            </p>
            <div className="hero-actions">
              <Link to="/equipment" className="btn btn-primary btn-lg">
                <FaSearch /> Browse Equipment
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                List Your Equipment
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>500+</strong>
                <span>Equipment Listed</span>
              </div>
              <div className="stat">
                <strong>1200+</strong>
                <span>Farmers Connected</span>
              </div>
              <div className="stat">
                <strong>50+</strong>
                <span>Districts Covered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Find the equipment you need for your farm</p>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/equipment?category=${cat.name}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <div className="category-icon">{cat.icon}</div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title">Why Choose FarmRent?</h2>
          <p className="section-subtitle">Everything you need to share and rent farm equipment</p>
          <div className="grid-3 features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Simple steps to rent or list equipment</p>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Register as a Farmer</h3>
              <p>Create your free account with your name, location, and phone number.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Search or List</h3>
              <p>Browse nearby equipment or list your own machinery with price and photos.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book & Connect</h3>
              <p>Request a booking, contact the owner, and confirm the rental dates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to reduce your farming costs?</h2>
          <p>Join thousands of farmers already using FarmRent across India.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/equipment" className="btn btn-secondary btn-lg">View Equipment</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
