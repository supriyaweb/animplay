import React, { useEffect, useState } from 'react';
import './ViewMedia.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProd } from '../../../Redux/AllSlices/AnimSlice';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { CiBoxList } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import StarRating from "../../../Custom/Rating/StarRating";
// import FilterPanel from "../../../Custom/FilterPanel/FilterPanel";



const ViewMedia = () => {

  const { isLoading, allProducts, error } = useSelector((state) => state.anim);
  const dispatch = useDispatch();
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

//---------------------------------------------------------------------------------------------------
  const [isGridView, setIsGridView] = useState(true); // Added state for view toggle

  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };
  const viewIcon = isGridView ? <CiBoxList /> : <CiGrid41 />;
//---------------------------------------------------------------------------------------------------

  useEffect(() => {
    dispatch(fetchAllProd())
      .then((response) => console.log('API Response:', response))
      .catch((error) => console.error('API Error:', error));
  }, [dispatch]);





//---------------------------------------------------------------------------------------------------
  // Function to sort products based on the selected criteria
  const sortProducts = (criteria) => {
    // Combine all anim_cat arrays into one
    let combinedProducts = [];
    allProducts.forEach((product) => {
      combinedProducts = combinedProducts.concat(product.anim_cat);
    });
  
    let sortedProducts = [];
  
    // Sort the combined array based on price
    if (criteria === 'lowest-to-Highest') {
      sortedProducts = combinedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (criteria === 'Highest-to-Lowest') {
      sortedProducts = combinedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else {
      // Default: no sorting
      sortedProducts = combinedProducts;
    }
  
    // Split the sorted array back into their respective products
    let startIndex = 0;
    setSortCriteria(criteria);
    const sortedShuffledProducts = shuffledProducts.map((product) => {
      const endIndex = startIndex + product.anim_cat.length;
      const sortedAnimCat = sortedProducts.slice(startIndex, endIndex);
      startIndex = endIndex;
      return { ...product, anim_cat: sortedAnimCat };
    });
  
    setShuffledProducts(sortedShuffledProducts);
  };
//---------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------
  const handleSearch = (e) => {
    console.log('Search term:', e.target.value);
    setSearchTerm(e.target.value);
    // const searchTermLower = e.target.value.toLowerCase();
    // setSearchTerm(searchTermLower);
  };
//---------------------------------------------------------------------------------------------------


  useEffect(() => {
    if (allProducts) {
      setShuffledProducts(allProducts);
    }
  }, [allProducts]);



  return (
    <>
      <div className="main-content" style={{ marginTop: '67px' }}></div>
      <div className="view_media">
        <div className='view_media_h1'>
          <h1>Your Animations...</h1>
        </div>
        {isLoading && <h3>...Loading</h3>}
        {error && <h3>{error}</h3>}


        <Container>
         <Row>
            <Col lg={1} md={{span: 2, order: 1}} sm={{span: 6, order: 3}} xs={{span: 6, order: 3}}>
              <div className="view-toggle">
                <button type="button" className="react-icons btn-ico" onClick={toggleView}>{viewIcon}</button>
              </div>
            </Col>
            <Col lg={6} md={{span: 4, order: 2}} sm={{span: 12, order: 1}} xs={{span: 12, order: 1}}>
              <div className="search-bar">
                <span className='search_icon'> <CiSearch/> </span>
                <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
              </div>
            </Col>
            <Col lg={3} md={{span: 4, order: 3}} sm={{span: 12, order: 2}} xs={{span: 12, order: 2}}>
              {/* <button onClick={() => sortProducts('lowest-to-Highest')}>
                Sort Lowest to Highest
              </button>
              <button onClick={() => sortProducts('Highest-to-Lowest')}>
                Sort Highest to Lowest
              </button> */}
                <select onChange={(e) => sortProducts(e.target.value)}>
                  <option value="" > Sort By Price </option>   
                  <option value="#" disabled></option>
                  <option value="lowest-to-Highest"> Lowest to Highest </option>
                  <option value="#" disabled></option>
                  <option value="Highest-to-Lowest"> Highest to Lowest </option>
                  <option value="#" disabled></option>
                </select>
            </Col>
            <Col lg={2} md={{span: 2, order: 4}} sm={{span: 6, order: 4}} xs={{span: 6, order: 4}}>
              <div className="filter-toggler">
                <button type="button" className="react-icons btn-ico"> <CiFilter/> </button>
                <p>Filter</p>
              </div>
            </Col>
          </Row>

          <div  className={isGridView ? 'view-card grid-view' : 'view-card list-view'}>
            <Row>
              {shuffledProducts
              .filter((product) => {
                const searchTermLower = searchTerm.toLowerCase();
                if (searchTerm === "") {
                  return true;  // If searchTerm is empty, return all products
                } else {
                  // Check anim_type specifically
                  if (product.anim_type?.toLowerCase().includes(searchTermLower)) {
                    return true;
                  }
                  // Check if the searchTerm is present in any of the desired fields
                  return (
                    product.anim_cat.some((cat) => cat.anim_name.toLowerCase().includes(searchTermLower)) ||
                    product.anim_cat.some((cat) => cat.sub_cat.toLowerCase().includes(searchTermLower)) ||
                    product.anim_cat.some((cat) => cat.genres.some((genre) => genre.toLowerCase().includes(searchTermLower))) ||
                    product.anim_cat.some((cat) => cat.director.toLowerCase().includes(searchTermLower)) ||
                    product.anim_cat.some((cat) => cat.author.toLowerCase().includes(searchTermLower)) ||
                    product.anim_cat.some((cat) => cat.studio.toLowerCase().includes(searchTermLower))
                  );
                }
              })
              .map((vlist, index) => {

                if (vlist.anim_cat && vlist.anim_cat.length > 0) {

                  return (
                    <React.Fragment key={index}>
                      {vlist.anim_cat
                        .filter((animItem) =>
                          animItem.anim_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animItem.sub_cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animItem.genres.some((genre) => genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          animItem.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animItem.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animItem.studio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vlist.anim_type.toLowerCase().includes(searchTerm.toLowerCase()) // Include anim_type check
                        )
                        .map((animItem) => (
                          
                          <Col key={animItem.sub_id} lg={3} md={4} sm={6} xs={12}>
                          <Card>
                            <Link to={`detail-media-user/${vlist.id}/${animItem.sub_id}`}>
                              <div className='wrap_cardimg'>
                                <Card.Img
                                  variant="top"
                                  src={animItem.poster_img_data && animItem.poster_img_data.length > 0 ? animItem.img_data : animItem.poster_img2_url}
                                  alt={animItem.anim_name}
                                />
                              </div>
                              <Card.Body>
                                <Card.Title>{animItem.anim_name}</Card.Title>
                                <Card.Text className='price_ab'>
                                  
                                  {/* {animItem.price} ₹ <span>Price</span>  */}
                                  {" "}
                                  {window.localStorage.getItem("email") &&
                                  window.localStorage.getItem("token") ? (
                                    <div><p>{animItem.price}</p>Free</div>
                                  ) : (
                                      `${animItem.price}₹`
                                  )}
                                  <span>Price</span>
                                </Card.Text>
                                <Card.Text className='rate_hv'>
                                  <StarRating rating={animItem.rate} /> &nbsp; {animItem.rate} &nbsp; <span>IMDB</span>
                                </Card.Text>
                              </Card.Body>
                            </Link>
                          </Card>
                        </Col>
                      ))}
                    </React.Fragment>
                  );
                } else {
                  return (
                    <Col key={index} lg={3} md={4} sm={6} xs={12}>
                      <p>No animation items found.</p>
                    </Col>
                  );
                }
              })}
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ViewMedia;
