import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './MyListingsPage.css';

const MyListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/equipment/my-listings');
      setListings(data.equipment);
    } catch (err) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from your listings?`)) return;
    try {
      await api.delete(`/equipment/${id}`);
      toast.success('Listing removed');
      fetchListings();
    } catch (err) {
      toast.error('Failed to remove listing');
    }
  };

  return (
    <div className="my-listings-page">
      <div className="container">
        <div className="page-header">
          <h1>My Equipment Listings</h1>
          <Link to="/equipment/new" className="btn btn-primary">
            <FaPlus /> Add New Equipment
          </Link>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <FaCalendarAlt />
            <h3>No listings yet</h3>
            <p>Start listing your farm equipment to earn extra income!</p>
            <Link to="/equipment/new" className="btn btn-primary">
              <FaPlus /> List Your Equipment
            </Link>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((eq) => {
              const imgSrc = eq.photos?.[0] || '/placeholder-equipment.png';
              return (
                <div key={eq._id} className="listing-card">
                  <div className="listing-img">
                    <img src={imgSrc} alt={eq.name} />
                    <span className="listing-category">{eq.category}</span>
                  </div>
                  <div className="listing-body">
                    <h3>{eq.name}</h3>
                    <p className="listing-location">{eq.district}, {eq.state}</p>
                    <p className="listing-price">₹{eq.pricePerDay}/day</p>
                    <div className="listing-meta">
                      <span>⭐ {eq.averageRating?.toFixed(1) || '—'} ({eq.totalRatings} reviews)</span>
                    </div>
                  </div>
                  <div className="listing-actions">
                    <Link to={`/equipment/${eq._id}`} className="btn btn-secondary btn-sm">View</Link>
                    <Link to={`/equipment/${eq._id}/edit`} className="btn btn-primary btn-sm">
                      <FaEdit /> Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(eq._id, eq.name)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;
