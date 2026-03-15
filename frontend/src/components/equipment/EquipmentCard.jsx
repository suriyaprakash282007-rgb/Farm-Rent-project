import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaRupeeSign } from 'react-icons/fa';
import './EquipmentCard.css';

const categoryColors = {
  Tractor: '#2d7a3a',
  Harvester: '#f57c00',
  Seeder: '#1565c0',
  'Water Pump': '#00838f',
  Plough: '#6a1b9a',
  Thresher: '#827717',
  Rotavator: '#558b2f',
  Sprayer: '#00695c',
  Other: '#546e7a',
};

const EquipmentCard = ({ equipment }) => {
  const {
    _id,
    name,
    category,
    pricePerDay,
    photos,
    district,
    state,
    averageRating,
    totalRatings,
    owner,
  } = equipment;

  const imgSrc = photos && photos.length > 0 ? photos[0] : '/placeholder-equipment.png';
  const catColor = categoryColors[category] || '#546e7a';

  return (
    <Link to={`/equipment/${_id}`} className="equipment-card">
      <div className="equipment-card-image">
        <img src={imgSrc} alt={name} loading="lazy" />
        <span className="equipment-badge" style={{ background: catColor }}>
          {category}
        </span>
      </div>
      <div className="equipment-card-body">
        <h3 className="equipment-name">{name}</h3>
        <div className="equipment-location">
          <FaMapMarkerAlt />
          <span>{district}, {state}</span>
        </div>
        <div className="equipment-meta">
          <div className="equipment-price">
            <FaRupeeSign />
            <strong>{pricePerDay}</strong>
            <span>/day</span>
          </div>
          {totalRatings > 0 && (
            <div className="equipment-rating">
              <FaStar />
              <span>{averageRating?.toFixed(1)} ({totalRatings})</span>
            </div>
          )}
        </div>
        {owner && (
          <p className="equipment-owner">by {owner.name}</p>
        )}
      </div>
    </Link>
  );
};

export default EquipmentCard;
