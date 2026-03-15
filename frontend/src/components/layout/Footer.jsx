import React from 'react';
import { FaTractor, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <FaTractor className="brand-icon" />
        <span className="brand-name">FarmRent</span>
        <p className="footer-tagline">Connecting farmers, sharing equipment, reducing costs.</p>
      </div>
      <div className="footer-links">
        <h4>Quick Links</h4>
        <Link to="/equipment">Browse Equipment</Link>
        <Link to="/register">Register as Farmer</Link>
        <Link to="/equipment/new">List Your Equipment</Link>
      </div>
      <div className="footer-links">
        <h4>Support</h4>
        <a href="mailto:support@farmrent.in">Contact Us</a>
        <a href="#">How It Works</a>
        <a href="#">Privacy Policy</a>
      </div>
      <div className="footer-social">
        <h4>Connect</h4>
        <div className="social-icons">
          <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} FarmRent. Built with ❤️ for India's farmers.</p>
    </div>
  </footer>
);

export default Footer;
