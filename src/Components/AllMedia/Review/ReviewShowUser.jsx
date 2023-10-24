import React, { useEffect, useState } from 'react';
import './ReviewShow.css'
import { useSelector, useDispatch } from 'react-redux';
import { deleteReview, editReview, fetchReview } from '../../../Redux/AllSlices/ReviewSlice';
import { Container, Row } from 'react-bootstrap';
import StarRating5 from "../../../Custom/Rating/StarRating5";
import ReviewEdit from './ReviewEdit';
import { GoCodeReview } from "react-icons/go";

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Pagination, Navigation, EffectCreative } from 'swiper/modules';
// import MyDropdown from '../../../Custom/Dropdown/Dropdown';



const ReviewShowUser = ({ animReviewName, signedInEmail }) => {


    const dispatch = useDispatch();
    const { status, reviewFetch, error } = useSelector((state) => state.reviews);


    useEffect(() => {
        dispatch(fetchReview());
    }, [dispatch]);



    const [filteredReviews, setFilteredReviews] = useState([]);
    useEffect(() => {
        // Filter reviews based on animReviewName and signedInEmail
        if (reviewFetch && animReviewName) {
            const filteredReviews = reviewFetch.filter((review) => review.topic === animReviewName && review.email === signedInEmail);
            setFilteredReviews(filteredReviews);
        }
    }, [reviewFetch, animReviewName, signedInEmail]);



//--------------------------------------------------------------------------------------------------------------
    const [selectedReview, setSelectedReview] = useState(null);

    const handleEdit = (review) => {
        setSelectedReview(review);
    };
    
    const handleSaveReview = (editedReview) => {
        setSelectedReview(null); // Close the edit modal
        // Dispatch the edit action
        dispatch(editReview({ id: editedReview.id, updatedReview: editedReview }))
        .then(() => {
            // Update the reviews state by replacing the edited review
            setFilteredReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review.id === editedReview.id ? editedReview : review
                )
            );
        })
        .catch((error) => {
            // Handle errors if needed
            console.error('Error editing review:', error);
        });

        console.log('handleSaveReview editedReview id and updatedReview:', editedReview.id, editedReview);
    };

//---------------------------------------------------------------------------------------------------------------
    const handleDelete = (reviewId) => {
        const confirmed = window.confirm('Are you sure you want to delete this review?');

        if (confirmed) {
            // Dispatch the delete action
            dispatch(deleteReview(reviewId))
            .then(() => {
                // Update the reviews state by filtering out the deleted review
                setFilteredReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
            })
            .catch((error) => {
                // Handle errors if needed
                console.error('Error deleting review:', error);
            });
        }
    };
//---------------------------------------------------------------------------------------------------------------
//-------------------------------------------------CustomDropdown------------------------------------------------
    // const mydropdownOptions = [
    //     {
    //         label: 'Edit',
    //         onClick: () => handleEdit(selectedReview)
    //     },
    //     {
    //         label: 'Delete',
    //         onClick: () => handleDelete(selectedReview.id)
    //     }
    // ];
//---------------------------------------------------------------------------------------------------------------

    // const signedInEmail = window.localStorage.getItem('email');   // here it remain off
    const canEditOrDelete = (review) => {
        return review.email === signedInEmail;
    };
//---------------------------------------------------------------------------------------------------------------




    return (
        <div className='reviews_section'>
            <h2>Reviews of {animReviewName}</h2>
            <h6>You can also tell us what you think about this film.</h6>
            <Container>
                <div className='reviews_section_box'>
                {status === 'loading' && <p>Loading reviews...</p>}
                {status === 'failed' && <p>Error fetching reviews: {error}</p>}
                {status === 'succeeded' && (
                    <Row>

                        {/* <swiper-container 
                        slides-per-view="1" 
                        speed="600" 
                        loop="true" 
                        css-mode="true" 
                        navigation="true" 
                        pagination="true" 
                        // scrollbar="true"
                        // autoplay="true"
                        > */}
                            {/* <div slot="container-start">Rendered before wrapper</div> */}
                            {/* <div slot="container-end">Rendered after wrapper</div> */}
                            {/* {filteredReviews.map((review) => (
                            <swiper-slide key={review.id}>
                                
                                <div className='review_box'>
                                    <div className='review_info'>
                                        <p>{review.email}</p>
                                        <p><StarRating5 rating={review.rating} /></p>
                                    </div>
                                    <div className='review_text'>
                                        <strong>Review: </strong>
                                        <p>{review.review_desc}</p>
                                    </div>
                                </div>
                            </swiper-slide>
                            ))}
                        </swiper-container> */}

                        <Swiper
                            pagination={{
                            type: 'fraction',
                            // clickable: true,
                            }}
                            navigation={true}
                            speed={600}
                            loop={true}
                            centeredSlides={true}
                            // Default parameters
                            // slidesPerView={1}
                            // spaceBetween={20}
                            // breakpoints={{
                            //     640: {
                            //       slidesPerView: 1,
                            //       spaceBetween: 20,
                            //     },
                            //     768: {
                            //       slidesPerView: 2,
                            //       spaceBetween: 30,
                            //     },
                            //     1024: {
                            //       slidesPerView: 3,
                            //       spaceBetween: 30,
                            //     },
                            // }}
                            
                            grabCursor={true}
                            effect={'creative'}
                            creativeEffect={{
                                prev: {
                                    translate: [0, 0, -400],
                                },
                                next: {
                                    translate: ['100%', 0, 0],
                                },
                            }}
                            
                            modules={[Pagination, Navigation, EffectCreative]}

                            className="mySwiper">

                            {filteredReviews.map((review) => (
                            <SwiperSlide key={review.id}>

                                <div className='review_box'>
                                    <div className='review_info'>
                                        <p>{review.email}</p>
                                        <p><StarRating5 rating={review.rating} /></p>
                                    </div>
                                    <div className='review_text'>
                                        <strong>Review: </strong>
                                        <p>{review.review_desc}</p>
                                    </div>
                                    {/* {window.localStorage.getItem('email') && ( // Check if user is signed in
                                        <>
                                            <button type="button" className="react-icons mainbtn" onClick={() => handleDelete(review.id)}>Delete <GoCodeReview/> </button>
                                            <button type="button" className="react-icons mainbtn" onClick={() => handleEdit(review)}>Edit <GoCodeReview/> </button>
                                        </>
                                    )} */}
                                    {canEditOrDelete(review) && ( // Check if user can edit or delete this review
                                        <>
                                            <button type="button" className="react-icons mainbtn" onClick={() => handleDelete(review.id)}>Delete <GoCodeReview/> </button>
                                            <button type="button" className="react-icons mainbtn" onClick={() => handleEdit(review)}>Edit <GoCodeReview/> </button>
                                        </>
                                    )}
                                    
                                    {/* Custom Dropdown */}
                                    {/* <div className="mydropdown-buttons">
                                        <MyDropdown title="Actions" options={mydropdownOptions} />
                                    </div> */}
                                </div>
                            </SwiperSlide>
                            ))}
                        </Swiper>

                    </Row>
                )}
                {/* Render the modal for editing review */}
                {selectedReview && (
                    <ReviewEdit review={selectedReview} onClose={() => setSelectedReview(null)} onSave={handleSaveReview} />
                )}
                </div>
            </Container>
        </div>
    );
};


export default ReviewShowUser;
