import React, { useEffect, useState } from 'react'
import './Review.css'
// import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Rating from "../../../Custom/Rating/Rating";
import { editReview } from '../../../Redux/AllSlices/ReviewSlice';
import {IoClose} from "react-icons/io5";



const ReviewEdit = ({ review, onClose, onSave }) => {


  const {reviews, status}=useSelector(state=> state.reviews)  //createSlice name
  console.log("UseSelector inReview :", reviews, status);


  const dispatch = useDispatch();

  const [editedReview, setEditedReview] = useState({
    email: review.email,
    topic: review.topic,
    review_desc: review.review_desc,
    rating: review.rating,
    id: review.id,
  });
  console.log("ReviewEdit IDcollect :", review.id);


  useEffect(() => {
    if (editedReview.review_desc !== undefined) {
      setEditedReview(prevState => ({
        ...prevState,
        review_desc: editedReview.review_desc,
      }));
    }
    if (editedReview.rating !== undefined) {
      setEditedReview(prevState => ({
        ...prevState,
        rating: editedReview.rating,
      }));
    }
  }, [editedReview.review_desc, editedReview.rating]);

  console.log("ReviewEdit editedReview useEffect :", editedReview);



  const handleChange = (event) => {
    event.persist();
    const { name, value } = event.target;
    // setEditedReview({ ...editedReview, [name]: value });
    setEditedReview(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRate = (value) => {
    // setEditedReview({ ...editedReview, rating: value });
    setEditedReview(prevState => ({ ...prevState, rating: value }));
  };



  const handleSave = (event) => {
    event.preventDefault();
    console.log("Data getting :", editedReview)

    const reviewData = {
      email: window.localStorage.getItem('email'),
      // topic: animName,
      review_desc: editedReview.review_desc,
      rating: editedReview.rating,
    };

    // Dispatch the editReview action passing the reviewData and the ID of the editedReview
    if (editedReview.id) {
      dispatch(editReview({ id: editedReview.id, updatedReview: reviewData }))
        .then(() => {
            // Update the reviews state after successful edit
            onSave(editedReview);
            onClose();
        })
        .catch((error) => {
            // Handle errors if needed
            console.error('Error editing review:', error);
        });
        
      console.log("Data submit id and ReviewData:", editedReview.id, reviewData)
    }

  }



  return (
    <>
      <div className="main-content" style={{ marginTop: '67px' }}></div>
      
      <div className="popup">
        <div className="popup-content">
          <div className="popup-text">
            <h4>{review.topic}</h4>
            <p>Rate this movie.</p>
            <h6>Reviews are public and include your account and device info</h6>
            <p>Everyone can see your Animplay Account name and photo associated with your review. Past edits are visible to users unless you delete your review.</p>
          </div>

          {/* <form action="" onSubmit={handleSubmit} id="ReviewForm"> */}

            <Rating onRate={handleRate} />
            <br />
            <textarea name="review_desc" id=""  value={editedReview.review_desc} onChange={handleChange}></textarea>
            <button type="button" className="react-icons mainbtn rvbt"  onClick={handleSave} > Submit Edit </button>

            <button type="button" className="react-icons btn-ico fading" onClick={onClose}> <IoClose/> </button>

          {/* </form> */}
        </div>
      </div>

    </>
  )
}

export default ReviewEdit