import React, { useEffect, useState } from 'react';
import './WatchMedia.css'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProd } from '../../../Redux/AllSlices/AnimSlice';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import StarRating from "../../../Custom/Rating/StarRating";


const shuffleAnimCat = (animCatArray) => {
  const shuffledArray = animCatArray.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const WatchMedia = () => {

  const { isLoading, allProducts, error } = useSelector((state) => state.anim);
  const dispatch = useDispatch();
  const [shuffledProducts, setShuffledProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchAllProd())
      .then((response) => console.log('API Response:', response))
      .catch((error) => console.error('API Error:', error));
  }, [dispatch]);


  useEffect(() => {
    if (allProducts) {
      const productsWithShuffledAnimCat = allProducts.map((product) => {
        const shuffledAnimCat = shuffleAnimCat(product.anim_cat);
        return { ...product, anim_cat: shuffledAnimCat };
      });
      setShuffledProducts(productsWithShuffledAnimCat);

      // Shuffle the products array
      // const shuffledProducts = shuffleAnimCat(productsWithShuffledAnimCat);
      // setShuffledProducts(shuffledProducts);
    }
  }, [allProducts]);


  return (
    <>
      <div className="main-content" style={{ marginTop: '67px' }}></div>
      <div className="watch_media">
        <div className='watch_media_h1'>
          <h1>Top Animation...</h1>
        </div>
        {isLoading && <h3>...Loading</h3>}
        {error && <h3>{error}</h3>}

        <div className="watch-card">
          <Container>
            {shuffledProducts.map((vlist, index) => (
              <React.Fragment key={index}>
                <Row className="mb-3">
                  <Col xs={12}>
                    <h5>{vlist.anim_type}</h5>
                  </Col>
                </Row>
                <Row>
                  {vlist.anim_cat && vlist.anim_cat.length > 0 ? (
                    vlist.anim_cat.map((animItem) => (

                      <Col key={animItem.sub_id} lg={2} md={3} sm={6} xs={12}>
                        <Card>
                          <Link to={`/detail-media/${vlist.id}/${animItem.sub_id}`}>
                            <div className='watch_cardimg'>
                              <Card.Img
                                variant="top"
                                src={animItem.poster_img_data && animItem.poster_img_data.length > 0 ? animItem.poster_img_data : animItem.poster_img_url}
                                alt={animItem.anim_name}
                              />
                            </div>
                            {/* <Card.Body>
                              <Card.Title>{animItem.anim_name}</Card.Title>
                              <Card.Text>Rate: {animItem.rate}</Card.Text>
                              <Card.Text>Price: {animItem.price} ₹</Card.Text>
                            </Card.Body> */}
                          </Link>
                        </Card>
                        <div className='mov_name'>
                          <h6>{animItem.anim_name}</h6>
                        </div>
                        <div className='watch_rate'>
                          <span>{animItem.rate}</span> &nbsp;<StarRating rating={animItem.rate} />
                        </div>
                      </Col>
                    ))
                  ) : (
                    <p>No animation items found.</p>
                  )}
                </Row>
              </React.Fragment>
            ))}
          </Container>
        </div>
      </div>
    </>
  );
};

export default WatchMedia;
