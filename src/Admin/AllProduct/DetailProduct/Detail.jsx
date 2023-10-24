import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './Detail.css';
import VideoModal from '../../../Custom/VideoModal/VideoModal';
import { FaPlay } from "react-icons/fa6";
import { RiEdit2Line } from "react-icons/ri";
import { RiDeleteBack2Line } from "react-icons/ri";



const Detail = () => {

  let navigate = useNavigate();
  const { id , sid } = useParams();
  console.log("id detail", id, "id detail", sid)

  const [product, setProduct] = useState(null);

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

  useEffect(() => {
    axios.get(`http://localhost:5000/animation/${id}`)
      .then((res) => {
        // console.log("Response Data", res.data)
        let mainProduct = res.data; // Get the main product object
        let single = mainProduct.anim_cat.find((x) => x.sub_id === sid);

        if (single) {
          setProduct({
            ...single, // Copy sub-category details
            anim_type: mainProduct.anim_type, // Add anim_type from the main product

            id: mainProduct.id // Adding the id property from the main product to get the value of the path for Edit page
          });
        } 
        else {
          alert("Product not found");
        }
      })
      .catch((err) => {
        alert("Error fetching product details:", err);
        console.log("Details error:", err);
      });
  }, [id, sid]);



  const deletion = () => {
    axios.get(`http://localhost:5000/animation/${id}`)
      .then((res) => {
        let mainProduct = res.data;
        mainProduct.anim_cat = mainProduct.anim_cat.filter((x) => x.sub_id !== sid);
        // Here we're filtering out the sub-product from the anim_cat array

        const confirmed = window.confirm('Are you sure you want to delete this Product ?');
        if (confirmed) {

          axios.put(`http://localhost:5000/animation/${id}`, mainProduct)
            .then((res) => {
              alert("Product Deleted Successfully");
              console.log("Product Deleted Successfully:", res);

              setProduct(null); // Clear the product state

              navigate('/admin/view');
            })
            .catch((err) => {
              alert("Error updating product:", err);
              console.log("Error updating product:", err);
            });
        }

      })
      .catch((err) => {
        alert("Error fetching product details:", err);
        console.log("Details error:", err);
      });
  };



  if (!product) {
    return <div>Loading...</div>; // Display a loading message until data is fetched that is why I used null in useState.
  }

  return (
    <div className="details">
      <div className="main-content" style={{ marginTop: "67px" }}></div>

        {product && (
          <>
            <div className="details-wrap">
              <div className="details-img">
                <div className="details_imgwrap">
                  {product.img_data && product.img_data.length > 0 ? 
                  (<img src={product.img_data} alt={product.anim_name} />
                  ) : (
                  <img src={product.img_url} alt={product.anim_name} />)}
                </div>

                <div className="details_container">
                  <div className="details-img_text">
                    <div className="img-poster">
                      {product.poster_img_data && product.poster_img_data.length > 0 ? 
                      (<img src={product.poster_img_data} alt={product.anim_name} />
                      ) : (
                      <img src={product.poster_img_url} alt={product.anim_name} />)}
                    </div>

                    <span>{product.anim_name}</span>
                    <h5>{product.anim_type}</h5>
                    <p>{product.sub_cat}- ₹{product.price}</p>
                  </div>
                  <div className="details-top-bt">
                    <button type="button" className="react-icons btn-ico" onClick={openModal}> <FaPlay/> </button>
                    <p>Trailer</p>
                  </div>
                </div>
              </div>

              <div className="details-text">
                <span>About This Movie</span>
                <p><b>Story:</b> {product.story}</p>
                {product.genres && (
                  <p><b>Genres:</b> {product.genres.join(", ")}</p>
                )}

                <p><b>Date:</b> {formatDate(product.release_date)}</p>
                <p><b>Duration:</b> {product.duration}</p>
                <p><b>Director:</b> {product.director}</p>
                <p><b>Author:</b> {product.author}</p>
                <p><b>Cast:</b> {product.cast}</p>
                <p><b>Studio:</b> {product.studio}</p>
                <p><b>Tags:</b> {product.tags.join(", ")}</p>
                <p><b>Rating:</b> {product.rate}</p>

                <div className="details-bt">
                  <button type="button" className="react-icons mainbtn" onClick={()=> deletion(id)}> Delete <RiDeleteBack2Line/> </button>
                  {/* <p>Product ID: {product.id}</p>
                  <p>Sub-product ID: {product.sub_id}</p> */}
                  <Link to={`/admin/edit/${product.id}/${product.sub_id}`}>
                    <button type="button" className="react-icons mainbtn"> Edit <RiEdit2Line/> </button>
                  </Link>
                </div>
              </div>

            {isModalOpen && (
              <VideoModal animnum={product.anim_name} videoUrl={product.video_url} closeModal={closeModal} />
            )}
            </div>
          </>
        )}

        {/* (using {product.genres && (...)}), it checks if product.genres exists (i.e., is not null or undefined) 
        before rendering the "Genres" paragraph. This is done to prevent an error in case product.genres is not available. 
        If product.genres is not defined, the expression inside the parentheses is not evaluated, and nothing is rendered for "Genres."
        Because, if product.genres is not defined (e.g., null or undefined), 
        it will throw an error because join cannot be called on a non-array value. */}
    </div>
  )
}

export default Detail;
