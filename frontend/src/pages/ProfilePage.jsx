import React, { useState, useEffect } from 'react';
import { FaUser, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    village: user?.village || '', district: user?.district || '',
    state: user?.state || '',
  });
  const [loading, setLoading] = useState(false);

  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', form);
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <h1>{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          {user?.averageRating > 0 && (
            <p className="profile-rating">⭐ {user.averageRating?.toFixed(1)} rating</p>
          )}
        </div>

        <div className="profile-form-card">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" value={form.name} onChange={f('name')} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" value={form.phone} onChange={f('phone')} />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Village</label>
                <input type="text" className="form-control" value={form.village} onChange={f('village')} />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input type="text" className="form-control" value={form.district} onChange={f('district')} />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input type="text" className="form-control" value={form.state} onChange={f('state')} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
