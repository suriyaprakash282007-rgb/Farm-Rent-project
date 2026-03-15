import React, { useState } from 'react';
import { FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format, differenceInCalendarDays, addDays } from 'date-fns';
import './BookingForm.css';

const BookingForm = ({ equipment, onSuccess }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    startDate: today,
    endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const days = differenceInCalendarDays(new Date(form.endDate), new Date(form.startDate)) + 1;
  const totalPrice = days > 0 ? days * equipment.pricePerDay : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (days < 1) {
      setError('End date must be on or after start date');
      return;
    }

    setLoading(true);
    try {
      await api.post('/bookings', {
        equipmentId: equipment._id,
        startDate: form.startDate,
        endDate: form.endDate,
        message: form.message,
      });
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-card">
      <h3 className="booking-title"><FaCalendarAlt /> Request Booking</h3>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="date-row">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              min={today}
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              min={form.startDate}
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="price-summary">
          <div className="price-row">
            <span>{days} day{days !== 1 ? 's' : ''} × ₹{equipment.pricePerDay}/day</span>
            <span className="price-total">
              <FaRupeeSign />{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Message to Owner (optional)</label>
          <textarea
            className="form-control"
            placeholder="Describe your requirement, crop type, or any specific needs..."
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={3}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Sending...' : 'Send Booking Request'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
