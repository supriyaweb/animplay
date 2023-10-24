import React from 'react';
import './StarRating5.css'
import { BsStarFill, BsStar } from 'react-icons/bs';

const StarRating5 = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < rating;
    return isFilled ? <BsStarFill key={index} /> : <BsStar key={index} />;
  });

  return <div className="star-rating5">{stars}</div>;
};

export default StarRating5;