import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTractor, FaBell, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import api from '../../utils/api';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.get('/auth/notifications').then(({ data }) => {
        const unread = data.notifications.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }).catch(() => {});
    }
  }, [user, location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <FaTractor className="brand-icon" />
          <span>FarmRent</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/equipment" className="nav-link" onClick={() => setMenuOpen(false)}>
            Browse Equipment
          </Link>
          {user ? (
            <>
              <Link to="/equipment/new" className="nav-link" onClick={() => setMenuOpen(false)}>
                List Equipment
              </Link>
              <Link to="/my-listings" className="nav-link" onClick={() => setMenuOpen(false)}>
                My Listings
              </Link>
              <Link to="/bookings" className="nav-link" onClick={() => setMenuOpen(false)}>
                My Bookings
              </Link>
              <Link to="/notifications" className="nav-link notif-link" onClick={() => setMenuOpen(false)}>
                <FaBell />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </Link>
              <div className="nav-dropdown">
                <button className="nav-user-btn">
                  <FaUser /> {user.name.split(' ')[0]}
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
