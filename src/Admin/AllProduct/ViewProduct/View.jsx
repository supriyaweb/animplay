import React, { useEffect, useState } from "react";
import './View.css'
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import CustomTooltip from "../../../Styles/MuiCustomStyles/CustomTooltip";
import Fade from '@mui/material/Fade';
import { Container, Row, Col } from 'react-bootstrap';


const View = () => {

  const get_api = "http://localhost:5000/animation";
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    axios.get(get_api)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        alert("Error to View Product :", err);
        console.log("Add err :", err);
      });
  }, [setProducts, get_api]);


  const deletion = (pid) => {
    console.log("Collected id for deleted :", pid)

    const confirmed = window.confirm('Are you sure you want to delete this Products group ?');
    if (confirmed) {

      axios.delete(`${get_api}/${pid}`)
        .then(res => {
          alert("Product Deleted Successfully")
          console.log("Product Deleted Successfully :", res);
          setProducts(prevProducts => prevProducts.filter(product => product.id !== pid));
        })
        .catch(err => {
          alert("Error to delete")
          console.log("Error to delete :", err);
        });
    }
  };


//---------------------------------------------------------------------------------------------------
  const handleSearch = (e) => {
    console.log('Search term:', e.target.value);
    setSearchTerm(e.target.value);
    // const searchTermLower = e.target.value.toLowerCase();
    // setSearchTerm(searchTermLower);
  };
//---------------------------------------------------------------------------------------------------

  

  return (
    <div className="views">
      <div className="main-content" style={{ marginTop: "67px" }}></div>

      <Container>

        <div className="card-container">
            <div className="search-bar">
              <span className='search_icon'> <CiSearch/> </span>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
            </div>

          {products.length > 0 ? (
            products
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
            .map((product) => (
              <div key={product.id}>

                <Row className="mb-3">
                  <Col xs={12} className="btnWrapper">
                    <h5>{product.anim_type}</h5>
                    <div className="btnWrap">
                      <CustomTooltip title="Delete" placement="left" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow>
                        <button type="button" className="react-icons btn-ico" onClick={() => deletion(product.id)}>
                          <FaTrashAlt/>
                        </button>
                      </CustomTooltip>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {product.anim_cat && product.anim_cat.length > 0 ? (
                    product.anim_cat
                    .filter((animItem) =>
                          animItem.anim_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animItem.sub_cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animItem.genres.some((genre) => genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          animItem.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animItem.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animItem.studio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.anim_type.toLowerCase().includes(searchTerm.toLowerCase()) // Include anim_type check
                        )
                    .map((animItem) => (
                      <Col key={animItem.sub_id} lg={3} md={4} sm={6} xs={12}>

                        <div className="card">
                          <Link to={`detail/${product.id}/${animItem.sub_id}`}>
                            <div className='view_cardimg'>
                              {animItem.img_data && animItem.img_data.length > 0 ? 
                                (<img src={animItem.img_data} alt={animItem.anim_name} />)
                                : (<img src={animItem.img_url} alt={animItem.anim_name} />)
                              }
                            </div>
                            <h2>{animItem.anim_name}</h2>
                            <p>{animItem.sub_cat} Animation</p>
                            <p>Studio: {animItem.studio}</p>
                            <p>Rating: {animItem.rate}</p>
                            <p>Price: ₹{animItem.price}</p>
                          </Link>

                          {/* <Link to={`/edit/${product.id}/${animItem.sub_id}`}>
                                <button className="mainbtn">Edit Product</button>
                              </Link> */}
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
            <p>Loading...</p>
          )}
        </div>
      </Container>
    </div>
  )
}

export default View;
