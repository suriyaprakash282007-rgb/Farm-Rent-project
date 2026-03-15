import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTractor, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    village: '', district: '', state: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to FarmRent!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">
          <FaTractor />
          <span>FarmRent</span>
        </div>
        <h2>Create Farmer Account</h2>
        <p className="auth-subtitle">Join thousands of farmers sharing equipment</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-control" placeholder="Your full name"
                value={form.name} onChange={f('name')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input type="tel" className="form-control" placeholder="10-digit mobile number"
                value={form.phone} onChange={f('phone')} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input type="email" className="form-control" placeholder="your@email.com"
              value={form.email} onChange={f('email')} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="password-input">
              <input
                type={showPass ? 'text' : 'password'}
                className="form-control"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={f('password')}
                required
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Village</label>
              <input type="text" className="form-control" placeholder="Your village"
                value={form.village} onChange={f('village')} />
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <input type="text" className="form-control" placeholder="e.g. Coimbatore"
                value={form.district} onChange={f('district')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">State</label>
            <input type="text" className="form-control" placeholder="e.g. Tamil Nadu"
              value={form.state} onChange={f('state')} />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
