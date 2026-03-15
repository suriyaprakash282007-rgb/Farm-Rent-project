import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaUpload, FaArrowLeft, FaTrash } from 'react-icons/fa';
import AvailabilityCalendar from '../components/equipment/AvailabilityCalendar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './EquipmentFormPage.css';

const CATEGORIES = ['Tractor', 'Harvester', 'Seeder', 'Water Pump', 'Plough', 'Thresher', 'Rotavator', 'Sprayer', 'Other'];

const EquipmentFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', category: 'Tractor', description: '',
    pricePerDay: '', village: '', district: '', state: '',
    ownerPhone: user?.phone || '', ownerWhatsapp: user?.phone || '',
  });
  const [photos, setPhotos] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/equipment/${id}`).then(({ data }) => {
        const eq = data.equipment;
        setForm({
          name: eq.name || '', category: eq.category || 'Tractor',
          description: eq.description || '', pricePerDay: eq.pricePerDay || '',
          village: eq.village || '', district: eq.district || '',
          state: eq.state || '', ownerPhone: eq.ownerPhone || '',
          ownerWhatsapp: eq.ownerWhatsapp || '',
        });
        setAvailability(eq.availability || []);
        setFetchLoading(false);
      }).catch(() => {
        toast.error('Equipment not found');
        navigate('/my-listings');
      });
    }
  }, [id, isEdit]);

  const f = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      photos.forEach((p) => formData.append('photos', p));

      let equipmentId = id;
      if (isEdit) {
        await api.put(`/equipment/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const { data } = await api.post('/equipment', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        equipmentId = data.equipment._id;
      }

      // Save availability
      if (equipmentId) {
        await api.put(`/equipment/${equipmentId}/availability`, { availability });
      }

      toast.success(isEdit ? 'Listing updated!' : 'Equipment listed!');
      navigate(`/equipment/${equipmentId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="container" style={{ padding: '3rem 0' }}><div className="spinner" /></div>;

  return (
    <div className="equipment-form-page">
      <div className="container">
        <Link to="/my-listings" className="back-link">
          <FaArrowLeft /> Back to my listings
        </Link>

        <h1>{isEdit ? 'Edit Equipment Listing' : 'List Your Equipment'}</h1>
        <p className="page-subtitle">
          {isEdit ? 'Update your equipment details' : 'Share your farm equipment with nearby farmers'}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="equipment-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Equipment Name *</label>
                <input type="text" className="form-control" placeholder="e.g. Mahindra Tractor 265 DI"
                  value={form.name} onChange={f('name')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-control" value={form.category} onChange={f('category')} required>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" placeholder="Describe your equipment, its condition, and any special features..."
                value={form.description} onChange={f('description')} rows={3} />
            </div>

            <div className="form-group half">
              <label className="form-label">Price per Day (₹) *</label>
              <input type="number" className="form-control" placeholder="500"
                min="0" value={form.pricePerDay} onChange={f('pricePerDay')} required />
            </div>
          </div>

          <div className="form-section">
            <h3>Location</h3>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Village</label>
                <input type="text" className="form-control" placeholder="Village name"
                  value={form.village} onChange={f('village')} />
              </div>
              <div className="form-group">
                <label className="form-label">District *</label>
                <input type="text" className="form-control" placeholder="e.g. Coimbatore"
                  value={form.district} onChange={f('district')} required />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input type="text" className="form-control" placeholder="e.g. Tamil Nadu"
                  value={form.state} onChange={f('state')} required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Details</h3>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" placeholder="10-digit mobile"
                  value={form.ownerPhone} onChange={f('ownerPhone')} />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Number</label>
                <input type="tel" className="form-control" placeholder="10-digit WhatsApp"
                  value={form.ownerWhatsapp} onChange={f('ownerWhatsapp')} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Equipment Photos</h3>
            <div className="photo-upload">
              <label className="photo-upload-label">
                <FaUpload />
                <span>Click to upload photos (max 5, 5MB each)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files).slice(0, 5);
                    setPhotos(files);
                  }}
                />
              </label>
              {photos.length > 0 && (
                <div className="photo-preview">
                  {photos.map((p, i) => (
                    <div key={i} className="preview-item">
                      <img src={URL.createObjectURL(p)} alt={`Preview ${i + 1}`} />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Availability Calendar</h3>
            <p className="section-hint">
              Click dates to mark them as available (green) or unavailable (red).
            </p>
            <AvailabilityCalendar availability={availability} onUpdate={setAvailability} />
          </div>

          <div className="form-actions">
            <Link to="/my-listings" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Listing' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentFormPage;
