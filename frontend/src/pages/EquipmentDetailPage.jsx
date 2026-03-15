import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaPhone, FaWhatsapp, FaStar, FaRupeeSign,
  FaCalendarAlt, FaUser, FaArrowLeft
} from 'react-icons/fa';
import AvailabilityCalendar from '../components/equipment/AvailabilityCalendar';
import StarRating from '../components/common/StarRating';
import BookingForm from '../components/booking/BookingForm';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './EquipmentDetailPage.css';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eqRes, revRes] = await Promise.all([
          api.get(`/equipment/${id}`),
          api.get(`/reviews/equipment/${id}`),
        ]);
        setEquipment(eqRes.data.equipment);
        setReviews(revRes.data.reviews);
      } catch (err) {
        toast.error('Equipment not found');
        navigate('/equipment');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '4rem 0' }}><div className="spinner" /></div>;
  if (!equipment) return null;

  const isOwner = user && equipment.owner._id === user.id;
  const photos = equipment.photos?.length > 0 ? equipment.photos : ['/placeholder-equipment.png'];

  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in renting your ${equipment.name} listed on FarmRent.`
  );

  return (
    <div className="equipment-detail-page">
      <div className="container">
        <Link to="/equipment" className="back-link">
          <FaArrowLeft /> Back to listings
        </Link>

        <div className="detail-grid">
          {/* Left: Images + Calendar */}
          <div className="detail-left">
            {/* Image Gallery */}
            <div className="image-gallery">
              <div className="main-image">
                <img src={photos[activeImg]} alt={equipment.name} />
              </div>
              {photos.length > 1 && (
                <div className="thumbnails">
                  {photos.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      alt={`${equipment.name} ${i + 1}`}
                      className={i === activeImg ? 'active' : ''}
                      onClick={() => setActiveImg(i)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Availability Calendar */}
            <div className="section-card">
              <h3 className="section-card-title"><FaCalendarAlt /> Availability Calendar</h3>
              <AvailabilityCalendar availability={equipment.availability} readOnly />
            </div>

            {/* Reviews */}
            <div className="section-card">
              <h3 className="section-card-title"><FaStar /> Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p className="text-muted">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map((r) => (
                    <div key={r._id} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">
                          <FaUser /> {r.reviewer?.name}
                        </span>
                        <StarRating value={r.rating} readOnly size="0.9rem" />
                      </div>
                      {r.comment && <p className="review-comment">{r.comment}</p>}
                      <span className="review-date">
                        {new Date(r.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Details + Booking */}
          <div className="detail-right">
            <div className="detail-card">
              <span className="detail-category">{equipment.category}</span>
              <h1 className="detail-name">{equipment.name}</h1>

              <div className="detail-price">
                <FaRupeeSign />
                <span className="price-amount">{equipment.pricePerDay}</span>
                <span className="price-unit">per day</span>
              </div>

              <div className="detail-rating">
                <StarRating value={equipment.averageRating} readOnly />
                <span className="rating-text">
                  {equipment.averageRating?.toFixed(1)} ({equipment.totalRatings} reviews)
                </span>
              </div>

              <hr className="divider" />

              <div className="detail-location">
                <FaMapMarkerAlt className="location-icon" />
                <div>
                  <p>{equipment.village && `${equipment.village}, `}{equipment.district}</p>
                  <p>{equipment.state}</p>
                </div>
              </div>

              {equipment.description && (
                <div className="detail-desc">
                  <h4>Description</h4>
                  <p>{equipment.description}</p>
                </div>
              )}

              <hr className="divider" />

              <div className="owner-section">
                <h4>Equipment Owner</h4>
                <div className="owner-info">
                  <div className="owner-avatar">
                    <FaUser />
                  </div>
                  <div>
                    <p className="owner-name">{equipment.owner?.name}</p>
                    <p className="owner-location">
                      <FaMapMarkerAlt /> {equipment.owner?.village}, {equipment.owner?.district}
                    </p>
                    {equipment.owner?.averageRating > 0 && (
                      <div className="owner-rating">
                        <StarRating value={equipment.owner.averageRating} readOnly size="0.85rem" />
                        <span>{equipment.owner.averageRating?.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              {equipment.ownerPhone && (
                <div className="contact-buttons">
                  <a
                    href={`tel:${equipment.ownerPhone}`}
                    className="btn btn-secondary"
                  >
                    <FaPhone /> Call Owner
                  </a>
                  <a
                    href={`https://wa.me/${equipment.ownerWhatsapp || equipment.ownerPhone}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                </div>
              )}

              {/* Booking Button */}
              {user && !isOwner && (
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setShowBooking(!showBooking)}
                >
                  <FaCalendarAlt /> {showBooking ? 'Hide Booking Form' : 'Request Booking'}
                </button>
              )}

              {!user && (
                <div className="login-prompt">
                  <Link to="/login" className="btn btn-primary btn-block">
                    Login to Book
                  </Link>
                </div>
              )}

              {isOwner && (
                <Link to={`/equipment/${id}/edit`} className="btn btn-secondary btn-block">
                  Edit Listing
                </Link>
              )}
            </div>

            {/* Booking Form */}
            {showBooking && user && !isOwner && (
              <BookingForm
                equipment={equipment}
                onSuccess={() => {
                  setShowBooking(false);
                  toast.success('Booking request sent!');
                  navigate('/bookings');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailPage;
