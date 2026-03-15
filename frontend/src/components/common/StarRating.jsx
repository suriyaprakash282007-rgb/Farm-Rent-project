import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ value = 0, onChange, readOnly = false, size = '1.2rem' }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating" style={{ display: 'inline-flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          style={{
            fontSize: size,
            color: star <= (hovered || value) ? '#ffc107' : '#e0e0e0',
            cursor: readOnly ? 'default' : 'pointer',
            transition: 'color 0.15s',
          }}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        />
      ))}
    </div>
  );
};

export default StarRating;
