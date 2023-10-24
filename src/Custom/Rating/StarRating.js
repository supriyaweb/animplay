import React from 'react';
import './StarRating.css';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const StarRating = ({ rating }) => {
  const stars = [];
  const maxStars = 5;

  // Determine the number of full stars
  const fullStars = Math.floor(rating / 2);
  for (let i = 0; i < fullStars; i++) {
    stars.push(<BsStarFill key={i} />);
  }

  // Handle half star
  if (rating % 2 !== 0) {
    stars.push(<BsStarHalf key="half" />);
  }

  // Fill the rest with empty stars
  const remainingStars = maxStars - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<BsStar key={i + fullStars} />);
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
