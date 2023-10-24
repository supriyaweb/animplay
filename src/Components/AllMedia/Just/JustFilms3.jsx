import React, { useRef, useEffect, useState } from 'react';
import '../WatchMedia/WatchMedia.css'
import './just.css'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProd } from '../../../Redux/AllSlices/AnimSlice';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import StarRating from "../../../Custom/Rating/StarRating";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Pagination, Navigation, EffectCreative } from 'swiper/modules';


const JustFilms3 = () => {


  const { isLoading, allProducts, error } = useSelector((state) => state.anim);
  const dispatch = useDispatch();
  const [animeProducts, setAnimeProducts] = useState([]);


  useEffect(() => {
    dispatch(fetchAllProd())
      .then((response) => {
        console.log('API Response:', response);
        if (response.payload) {
          const animeProductsArray = response.payload.filter(product => product.anim_type.toLowerCase() === '3d animation');
          setAnimeProducts(animeProductsArray);
        }
      })
      .catch((error) => console.error('API Error:', error));
  }, [dispatch]);



  return (
    <div className='justAnime'>

      <div className="main-content" style={{ marginTop: '30px' }}></div>
      <div className="watch_media">
        {/* <div className='watch_media_h1'>
          <h1>Top Animation...</h1>
        </div> */}
        {isLoading && <h3>...Loading</h3>}
        {error && <h3>{error}</h3>}

        <div className="watch-card">
          <Container>
            {animeProducts.map((vlist, index) => (
              <React.Fragment key={index}>
                <Row className="mb-3">
                  <Col xs={12}>
                    <h5>All {vlist.anim_type} Movies</h5>
                  </Col>
                </Row>

                <Row> 

                <Swiper
                  slidesPerView={5}
                  // centeredSlides={true}
                  navigation={true}
                  spaceBetween={30}
                  // grabCursor={true}
                  // pagination={{
                  //   clickable: true,
                  // }}
                  creativeEffect={{
                    prev: {
                        translate: [0, 0, -400],
                    },
                    next: {
                        translate: ['100%', 0, 0],
                    },
                  }}

                  modules={[Pagination, Navigation, EffectCreative]}
                  className="mySwiper"
                >

                  {vlist.anim_cat && vlist.anim_cat.length > 0 ? (
                    vlist.anim_cat.map((animItem) => (

                      <SwiperSlide  key={animItem.sub_id}>

                      {/* <Col key={animItem.sub_id} lg={2} md={3} sm={6} xs={12}> */}
                        <Card>
                          <Link to={`/detail-media/${vlist.id}/${animItem.sub_id}`}>
                            <div className='watch_cardimg'>
                              <Card.Img
                                variant="top"
                                src={animItem.poster_img_data && animItem.poster_img_data.length > 0 ? animItem.poster_img_data : animItem.poster_img_url}
                                alt={animItem.anim_name}
                              />
                            </div>
                          </Link>
                        </Card>
                        <div className='mov_name'>
                          <h6>{animItem.anim_name}</h6>
                        </div>
                        {/* <div className='watch_rate'>
                          <span>{animItem.rate}</span> &nbsp;<StarRating rating={animItem.rate} />
                        </div> */}
                      {/* </Col> */}

                      </SwiperSlide>

                    ))
                  ) : (
                    <p>No animation items found.</p>
                  )}

                </Swiper>

                </Row>
              </React.Fragment>
            ))}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default JustFilms3;


