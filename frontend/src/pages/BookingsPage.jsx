import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaRupeeSign, FaCheck, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './BookingsPage.css';

const statusConfig = {
  pending: { label: 'Pending', className: 'badge-warning' },
  confirmed: { label: 'Confirmed', className: 'badge-success' },
  cancelled: { label: 'Cancelled', className: 'badge-danger' },
  completed: { label: 'Completed', className: 'badge-secondary' },
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('renter'); // renter or owner

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings', { params: { role } });
      setBookings(data.bookings);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [role]);

  const updateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking');
    }
  };

  return (
    <div className="bookings-page">
      <div className="container">
        <h1>My Bookings</h1>

        <div className="role-tabs">
          <button
            className={`tab-btn ${role === 'renter' ? 'active' : ''}`}
            onClick={() => setRole('renter')}
          >
            Bookings I Made
          </button>
          <button
            className={`tab-btn ${role === 'owner' ? 'active' : ''}`}
            onClick={() => setRole('owner')}
          >
            Booking Requests Received
          </button>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <FaCalendarAlt />
            <h3>No bookings found</h3>
            <p>
              {role === 'renter'
                ? "You haven't made any booking requests yet."
                : "You haven't received any booking requests yet."}
            </p>
            {role === 'renter' && (
              <Link to="/equipment" className="btn btn-primary">Browse Equipment</Link>
            )}
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              const equipImg = booking.equipment?.photos?.[0] || '/placeholder-equipment.png';

              return (
                <div key={booking._id} className="booking-card">
                  <div className="booking-img">
                    <img src={equipImg} alt={booking.equipment?.name} />
                  </div>
                  <div className="booking-info">
                    <div className="booking-header">
                      <h3 className="booking-equipment-name">
                        <Link to={`/equipment/${booking.equipment?._id}`}>
                          {booking.equipment?.name}
                        </Link>
                      </h3>
                      <span className={`badge ${status.className}`}>{status.label}</span>
                    </div>

                    <div className="booking-meta">
                      <div className="meta-item">
                        <FaCalendarAlt />
                        <span>
                          {new Date(booking.startDate).toLocaleDateString('en-IN')} –{' '}
                          {new Date(booking.endDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="meta-item">
                        <FaRupeeSign />
                        <span>{booking.totalPrice?.toLocaleString('en-IN')} ({booking.totalDays} days)</span>
                      </div>
                    </div>

                    <div className="booking-parties">
                      {role === 'renter' ? (
                        <span className="party-info">
                          <FaMapMarkerAlt /> Owner: {booking.owner?.name} — {booking.owner?.phone}
                        </span>
                      ) : (
                        <span className="party-info">
                          <FaMapMarkerAlt /> Renter: {booking.renter?.name} — {booking.renter?.phone}
                        </span>
                      )}
                    </div>

                    {booking.message && (
                      <p className="booking-message">"{booking.message}"</p>
                    )}
                  </div>

                  {/* Owner actions */}
                  {role === 'owner' && booking.status === 'pending' && (
                    <div className="booking-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateStatus(booking._id, 'confirmed')}
                      >
                        <FaCheck /> Confirm
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(booking._id, 'cancelled')}
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}

                  {/* Owner: mark complete */}
                  {role === 'owner' && booking.status === 'confirmed' && (
                    <div className="booking-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => updateStatus(booking._id, 'completed')}
                      >
                        Mark Completed
                      </button>
                    </div>
                  )}

                  {/* Renter: cancel pending booking */}
                  {role === 'renter' && booking.status === 'pending' && (
                    <div className="booking-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(booking._id, 'cancelled')}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
