import React, { useEffect, useState } from 'react'
import './DetailMedia.css';
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailProd } from '../../../Redux/AllSlices/AnimSlice';
import { Link, useParams } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap';
import VideoModal from '../../../Custom/VideoModal/VideoModal';
import Review from '../Review/Review';

import { FaPlay } from "react-icons/fa6";
import { GoCodeReview } from "react-icons/go";
import { AiOutlineYoutube } from "react-icons/ai";
import ReviewShowUser from '../Review/ReviewShowUser';
import MediaTags from '../MediaTag/MediaTags';



const DetailMediaUser = () => {

    const { id, dm } = useParams();
    console.log("dmedia id detail", id, "dmedia id detail", dm)
    
    const dispatch = useDispatch();
    
    const { isLoading, selectedProduct, error } = useSelector(state => state.anim)
    console.log("UseSelector plist :", isLoading, selectedProduct, error)




//---------------------------------------------------------------------------------------------------
    const formatDate = (dateString) => {    // Show release date as "month day, year"
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    // const formatDate = (dateString) => {    // Show release date as "year"
    //   const options = { year: 'numeric' };
    //   return new Date(dateString).toLocaleDateString(undefined, options);
    // };
//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        console.log('Opening modal...');
        setIsModalOpen(true);
    };
    const closeModal = () => {
        console.log('Closing modal...');
        setIsModalOpen(false);
    };
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
    const [isPopOpen, setIsPopOpen] = useState(false);

    const onSubmit = (animName) => {
        console.log('Opening Pop for', animName);
        setIsPopOpen(true);
    };
    const onClose = () => {
        console.log('Closing Pop...');
        setIsPopOpen(false);
    };
//---------------------------------------------------------------------------------------------------
    const [reviews, setReviews] = useState([]);

    const onSubmitReview = (newReview) => {
        // Update the reviews state with the new review
        setReviews((prevReviews) => [...prevReviews, newReview]);
        setIsPopOpen(false);  // Close the review modal
    };


    
    useEffect(() => {
        // console.log("Fetching product with id:", id, "and dm:", dm);
        let details={id:id,dm:dm}

        // dispatch(fetchDetailProd({ id, dm }))
        dispatch(fetchDetailProd(details))
        .then(res=>{
            console.log("Fetched: ",res.payload);
        })
        .catch(err=>{
            console.log("Error to fetch: ",err);
        });

    }, [dispatch]);




//-----------------------------------------------------------------------------------------
    const handleReviewButtonClick = () => {
        const userEmail = window.localStorage.getItem('email');
    
        if (!userEmail) {
        // User is not signed in, show alert and redirect to sign-in page
        alert('You need to sign in first to write a review.');
        // Redirect to sign-in page (replace '/signin' with your actual sign-in route)
        window.location.replace('/sign-in');
        } else {
        // User is signed in, allow them to write a review
        onSubmit(selectedProduct.anim_name); // Pass the parameter to onSubmit
        setIsPopOpen(true);
        }
    };
//-----------------------------------------------------------------------------------------
//------------------------------------------only one review------------------------------------------
    const signedInEmail = window.localStorage.getItem('email');
//---------------------------------------------------------------------------------------------------



    return (
        <>
            <div className="main-content" style={{ marginTop: '67px' }}></div>
            <div className="detail_media">
                
                {isLoading && <h3>...Loading</h3>}
                {error && <h3>{error}</h3>}

                    {selectedProduct && (
                    <>
                        <div className="details-wrap">
                            <div className="details-img">
                                <div className="details_imgwrap">
                                    {selectedProduct.img_data && selectedProduct.img_data.length > 0 ? 
                                    (<img src={selectedProduct.img_data} alt={selectedProduct.anim_name} />
                                    ) : (
                                    <img src={selectedProduct.img_url} alt={selectedProduct.anim_name} />)}
                                </div>

                                <div className="details_container">
                                    <div className="details-img_text">
                                        <div className="img-poster">
                                            {selectedProduct.poster_img_data && selectedProduct.poster_img_data.length > 0 ? 
                                            (<img src={selectedProduct.poster_img_data} alt={selectedProduct.anim_name} />
                                            ) : (
                                            <img src={selectedProduct.poster_img_url} alt={selectedProduct.anim_name} />)}
                                        </div>

                                        <span>{selectedProduct.anim_name}</span>
                                        <h5>{selectedProduct.duration} &nbsp;| {formatDate(selectedProduct.release_date)} &nbsp;| {selectedProduct.rate} <em>IMDB</em> </h5>
                                        <p>
                                            {/* {selectedProduct.sub_cat}-{" "} */}
                                            {window.localStorage.getItem("email") &&
                                            window.localStorage.getItem("token") ? (
                                                <button type="button" className="react-icons mainbtn"> Free for one month </button>
                                            ) : (
                                                <button type="button" className="react-icons mainbtn"> ₹{selectedProduct.price} Buy HD </button>
                                            )}
                                        </p>
                                    </div>
                                    <div className="details-top-bt">
                                        <button type="button" className="react-icons btn-ico" onClick={openModal}> <FaPlay/> </button>
                                        <p>Trailer</p>
                                    </div>
                                </div>
                            </div>

                            <div className="details-text">
                                <h1>Sign in to AnimPlay & Subscribe our YouTube channel to get 1 Month Free Movies.</h1>
                                <button type="button" className="react-icons mainbtn"> YouTube <AiOutlineYoutube/> </button>
                            </div>
                            <Container>
                                <div className="details-box">
                                    <h2>About This Movie</h2>
                                    <div className="detailbox_g">
                                        <Row>
                                        <Col lg={6} md={6} sm={12} xs={12}>
                                            <div className="detailbox_g1">
                                                <p><b>Story:</b> {selectedProduct.story}</p>
                                                <p><b>Studio:</b> {selectedProduct.studio}</p>
                                                {selectedProduct.genres && (
                                                    <p><b>Genres:</b> <span>{selectedProduct.genres.join(", ")}</span></p>
                                                )}
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} sm={12} xs={12}>
                                            <div className="detailbox_g2">
                                                <p><b>Cast:</b> {selectedProduct.cast}</p>
                                                <p><b>Director:</b> {selectedProduct.director}</p>
                                                <p><b>Author:</b> {selectedProduct.author}</p>
                                                {selectedProduct.tags && (
                                                    <p><b>Tags:</b> {selectedProduct.tags.join(", ")}</p>
                                                )}
                                            </div>
                                        </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Container>
                            {/* Display reviews */}
                            <ReviewShowUser animReviewName={selectedProduct.anim_name} signedInEmail={signedInEmail} />
                            
                            <div className="details-bt_wrap">
                                <div className="details-bt">
                                    {/* <Link to={`/edit/${selectedProduct.id}/${selectedProduct.sub_id}`}>
                                        <button className="mainbtn">Edit selectedProduct</button>
                                    </Link> */}

                                    {/* <Link to={`/review/${selectedProduct.anim_name}`}> */}
                                        <button
                                            type="button"
                                            className={`react-icons btn-ico ${reviews.length > 0 ? 'write-review-button' : ''}`}
                                            onClick={handleReviewButtonClick}
                                        >
                                            <GoCodeReview />
                                        </button>
                                        <p>Write a Review</p>
                                    {/* </Link> */}
                                </div>
                            </div>
                            {isModalOpen && (
                            <VideoModal animnum={selectedProduct.anim_name} videoUrl={selectedProduct.video_url} closeModal={closeModal} />
                            )}
                            {isPopOpen && (
                            <Review animName={selectedProduct.anim_name} onSubmit={onSubmitReview} onClose={() => setIsPopOpen(false)} />
                            )}

                        </div>
                    </>
                    )}

                {/* <p>{id}</p>
                <p>{selectedProduct.tags}</p> */}
                {/* <MediaTags selectedTags={selectedProduct.tags} selectedId={id} /> */}
                <MediaTags selectedTags={selectedProduct ? selectedProduct.tags : []}  selectedId={id}  selectedSubId={selectedProduct.sub_id} />
            </div>
        </>
    )
}

export default DetailMediaUser