import React, { useState } from 'react';
import './Rating.css';

const Rating = ({ onRate }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (value) => {
    setRating(value);
    onRate(value);
  };

  const handleMouseOver = (value) => {
    setRating(value);
  };

  const handleMouseLeave = () => {
    // Reset to the previous rating when mouse leaves the component
    onRate(rating);
  };

  const stars = [1, 2, 3, 4, 5].map((value) => (
    <span
      key={value}
      className={value <= rating ? 'star filled' : 'star'}
      onMouseOver={() => handleMouseOver(value)}
      onMouseLeave={handleMouseLeave}
      onClick={() => handleRating(value)}
    >
      ★
    </span>
  ));

  return <div className="rating">{stars}</div>;
};

export default Rating;
