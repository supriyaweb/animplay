import React, { useState } from 'react'
import './Review.css'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Rating from "../../../Custom/Rating/Rating";
import { addReview } from '../../../Redux/AllSlices/ReviewSlice';
import {IoClose} from "react-icons/io5";



const Review = ({ animName, onClose, onSubmit }) => {

  const dispatch = useDispatch();

  // collect topic from url through useParams, // will need here when the movie name i find through the url path using RootRouting.
  // const { topic } = useParams();
  // console.log("review topic detail", topic)
  
  const {reviews, status}=useSelector(state=> state.reviews)  //createSlice name
  console.log("UseSelector inReview :", reviews, status);

/* after handleChange
    let handleSubmit=(event)=>{
    event.preventDefault();
    let reviewData={
        email: window.localStorage.getItem('email),
        topic:topic,
        review_desc:desc,
        rating:rating
    }
    send reviewData for dispatch
    } */



  const [reviewer, setReviewer] = useState({
    review_desc: '',
    rating: 0,
  });

  const handleChange = (event) => {
    event.persist();
    const { name, value } = event.target;
    setReviewer({ ...reviewer, [name]: value });
  };

  const handleRate = (value) => {
    setReviewer({ ...reviewer, rating: value });
  };


  
  const handleSubmit = (event) => {

    event.preventDefault();
    console.log("Data submit :", reviewer)

    const reviewData = {
      email: window.localStorage.getItem('email'),
      topic: animName,
      review_desc: reviewer.review_desc,
      rating: reviewer.rating,
    };

    dispatch(addReview(reviewData))
    .then((response) => {
      // Assuming the response contains the new review with an id
      const newReview = response.payload; 
      // Call the onSubmit function passed via props to update the parent component's state
      onSubmit(newReview);

      window.location.reload();  // Reload the page after review submission
      
      // Handle any necessary UI updates or state changes after adding the review
      // For example, close the review modal, clear the form, etc.
      setReviewer({
        review_desc: '',
        rating: 0,
      });

      // Simulate an asynchronous operation (e.g., fetching data)
        setTimeout(() => {
          onClose();  // Close the review modal after 5 seconds [ THIS IS FOR TO FETCH NEW REVIEW IN DETAILMEDIA.JS WITHOUT REFESHING THE PAGE. ]
        }, 5000);
    })
    .catch((error) => {
      // Handle errors if needed
      console.error('Error adding review:', error);
    });
  }



  return (
    <>
      <div className="main-content" style={{ marginTop: '67px' }}></div>
      
      <div className="popup">
        <div className="popup-content">
          <div className="popup-text">
            <h4>{animName}</h4>
            <p>Rate this movie.</p>
            <h6>Reviews are public and include your account and device info</h6>
            <p>Everyone can see your Animplay Account name and photo associated with your review. Past edits are visible to users unless you delete your review.</p>
          </div>

          {/* <form action="" onSubmit={handleSubmit} id="ReviewForm"> */}

            <Rating onRate={handleRate} />
            <br />
            <textarea name="review_desc" id="" placeholder="Your Review" onChange={handleChange}></textarea>
            <button type="button" className="react-icons mainbtn rvbt"  onClick={handleSubmit} > Submit </button>

            <button type="button" className="react-icons btn-ico fading" onClick={onClose}> <IoClose/> </button>

          {/* </form> */}
        </div>
      </div>

    </>
  )
}

export default Review