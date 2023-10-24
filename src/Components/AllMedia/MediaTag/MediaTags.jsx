import React, { useEffect, useState, useRef } from 'react'
import './MediaTags.css';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Container, Row, Col } from 'react-bootstrap';
import { fetchProducts } from '../../../Redux/AllSlices/AnimSlice';



const shuffleAnimCat = (animCatArray) => {
    const shuffledArray = animCatArray.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};


const MediaTags = ({selectedTags, selectedId, selectedSubId}) => {

    const bottomRef = useRef(); // Create a ref for the bottom of the product list


    const dispatch = useDispatch();

    const allProducts = useSelector((state) => state.anim.allProducts);
    console.log("allProducts from Redux state:", allProducts);
   
    // Adjusted state usage
    const [shuffledProducts, setShuffledProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState(12);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    
    const [similarProducts, setSimilarProducts] = useState([]);
    console.log("Similar Products to display:", similarProducts);


    useEffect(() => {
        dispatch(fetchProducts()); // Fetch products
    }, [dispatch, selectedTags, selectedId, selectedSubId]);


    useEffect(() => {
        console.log("allProducts:", allProducts);
        console.log("selectedTags:", selectedTags);
        console.log("selectedId:", selectedId);
        console.log("selectedSubId:", selectedSubId);
        
        // Filter and shuffle products whenever allProducts, selectedTags, or selectedId change
        if (!Array.isArray(selectedTags) || !Array.isArray(allProducts)) return;

        // Filter products based on selectedTags, selectedId, and selectedSubId
        const filteredProducts = allProducts.map((product) => {
            if (product.id === parseInt(selectedId)) {
                // Exclude the product with the selected sub_id
                if (product.anim_cat) {
                    const filteredAnimCat = product.anim_cat.filter(category => category.sub_id !== selectedSubId);
                    return { ...product, anim_cat: filteredAnimCat };
                }
            }
            return null;  // Return null for products with different id
        }).filter(product => product !== null);  // Filter out null products

        console.log("Last filteredProducts:", filteredProducts);

        
        const productsWithShuffledAnimCat = filteredProducts.map((product) => {     // Added the shuffled products useEffect code
            if (product.anim_cat) {
                const shuffledAnimCat = shuffleAnimCat(product.anim_cat);
                return { ...product, anim_cat: shuffledAnimCat };
            }
            return product;
        }).filter(product => {
            if (product.anim_cat && Array.isArray(product.anim_cat)) {
                const hasMatchingTags = product.anim_cat.some((category) => {
                    if (category.tags && Array.isArray(category.tags)) {
                        return selectedTags.some((tag) => category.tags.includes(tag));
                    }
                    return false;
                });
                return hasMatchingTags;
            }
            return false;
        });

        setSimilarProducts(productsWithShuffledAnimCat); // Store the filtered and shuffled products
        setShuffledProducts(productsWithShuffledAnimCat);

    }, [allProducts, selectedTags, selectedId, selectedSubId, displayedProducts]);


    

    console.log("Last Similar Products to display:", similarProducts);

    const loadMoreProducts = () => {
        const currentPosition = window.pageYOffset; // Capture the current scroll position

        // Calculate the total number of products in anim_cat
        const totalProducts = similarProducts.reduce((acc, product) => {
            return acc + (product.anim_cat ? product.anim_cat.length : 0);
        }, 0);

        const remainingProducts = totalProducts - displayedProducts;
        const newDisplayCount = displayedProducts + (remainingProducts >= 12 ? 12 : remainingProducts);
        setDisplayedProducts(newDisplayCount);

        // Disable the button when all filtered products are displayed
        if (newDisplayCount >= totalProducts) {
            setHasMoreProducts(false);
        }

        // Scroll to the bottom of the new content
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    
    console.log('Displayed Products:', displayedProducts);
    console.log('Filtered Products Length:', shuffledProducts.length);
    console.log('Filtered Products:', shuffledProducts);




    return (
        <>
            {/* New section for displaying similar products */}
            <div className="similar_products">
                <Container>
                    <div className="similar_card">
                        <h2>Similar Like This...</h2>

                        {shuffledProducts.length > 0 ? (
                            shuffledProducts.map((product, index) => (
                            <div key={product.id}>

                                <Row ref={index === shuffledProducts.length - 1 ? bottomRef : null}>

                                {product.anim_cat && product.anim_cat.length > 0 ? (
                                    product.anim_cat.slice(0, displayedProducts).map((animItem) => (
                                        
                                        <Col key={animItem.sub_id} lg={3} md={4} sm={6} xs={12}>
                                            
                                        <Card>
                                        <Link to={`/detail-media/${product.id}/${animItem.sub_id}`} target="_blank">
                                            <div className='similar_cardimg'>
                                                <Card.Img
                                                variant="top"
                                                src={animItem.poster_img_data && animItem.poster_img_data.length > 0 ? animItem.img_data : animItem.poster_img2_url}
                                                alt={animItem.anim_name}
                                                />
                                            </div>
                                        </Link>
                                        </Card>
                                        <div className='sim_mov_name'>
                                        <h6>{animItem.anim_name}</h6>
                                        </div>
                                    </Col>
                                    ))
                                ) : (
                                    <p>No animation items found.</p>
                                )}
                                </Row>
                            </div>
                            ))
                        ) : (
                            <p>...Loading</p>
                        )}

                        {hasMoreProducts && (
                            <div className="hidebox">
                                <span></span>
                                <button type="button" className=" react-icons mainbtn Loadbt" onClick={loadMoreProducts}> Load More </button>
                            </div>
                        )}
                        {/* {!hasMoreProducts && (
                            <p className='nomore'>No more similar products to display.</p>
                        )} */}
                    </div>
                </Container>
            </div>
        </>
      )
    }

export default MediaTags