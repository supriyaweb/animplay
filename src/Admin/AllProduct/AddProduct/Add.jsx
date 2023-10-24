import React, { useState, useEffect } from "react";
import "./Add.css";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";

import CustomTooltip from "../../../Styles/MuiCustomStyles/CustomTooltip";
import Fade from '@mui/material/Fade';

import { useNavigate } from "react-router-dom";
// import ImageCompressor from 'image-compressor';
// npm install image-compressor
// import imageCompression from 'image-compression';
// npm install image-compression
import imageCompression from 'browser-image-compression';
// npm install browser-image-compression



const Add = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    anim_type: "",
    anim_cat: [
      { sub_id: `S${Date.now()}`, 
      anim_name: "", 
      img_url: "", 
      img_data: null, 
      video_url: "", 
      poster_img_url: "", 
      poster_img_data: null, 
      sub_cat: "", price: "", story: "", 
      genres: [], 
      release_date: "", duration: "", director: "", author: "", cast: "", 
      tags: [], 
      studio: "", rate: "",
      },
    ],
  });

  const [isAnimTypeSelected, setIsAnimTypeSelected] = useState(false);    // For open and close of the disable attribute for fieldset, when upper input area of the main product has not any value or empty.

  const [mainProductId, setMainProductId] = useState(null);   // State to store the ID of the main product


//---------------------------------------------------------------------------------------------------
  const [bannerImageType, setBannerImageType] = useState({});   // Track banner image type for each sub-category
  const [posterImageType, setPosterImageType] = useState({});   // Track poster image type for each sub-category

  const handleBannerImageTypeChange = (index, type) => {   // Track banner image type for each sub-category
    setBannerImageType((prevImageType) => ({
      ...prevImageType,
      [index]: type,
    }));
  };

  const handlePosterImageTypeChange = (index, type) => {   // Track poster image type for each sub-category
    setPosterImageType((prevImageType) => ({
      ...prevImageType,
      [index]: type,
    }));
  };
//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------
  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
  
    try {
      const options = {
        maxSizeMB: 0.5,  // Adjust the quality (0 to 1)
        maxWidthOrHeight: 800,  // Adjust the maximum width and height
      };
  
      const compressedFile = await imageCompression(file, options);
      const compressedBase64 = await toBase64(compressedFile);
  
      // Clear img_url when uploading a new image
      const newSubCategory = [...formData.anim_cat];
      newSubCategory[index].img_url = "";

      // Set img_data with the new image
      newSubCategory[index].img_data = compressedBase64;

      setFormData((prevFormData) => ({
        ...prevFormData,
        anim_cat: newSubCategory,
      }));
    
    } catch (error) {
      console.error('Error handling banner image:', error);
    }
  };


  const handlePosterImageChange = async (e, index) => {
    const file = e.target.files[0];
  
    try {
      const options = {
        maxSizeMB: 0.5,  // Adjust the quality (0 to 1)
        maxWidthOrHeight: 800,  // Adjust the maximum width and height
      };
  
      const compressedFile = await imageCompression(file, options);
      const compressedBase64 = await toBase64(compressedFile);
  
      const newSubCategory = [...formData.anim_cat];
      newSubCategory[index].poster_img_url = "";
      newSubCategory[index].poster_img_data = compressedBase64;

      setFormData((prevFormData) => ({
        ...prevFormData,
        anim_cat: newSubCategory,
      }));
    
    } catch (error) {
      console.error('Error handling poster image:', error);
    }
  };
  
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
       // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
//---------------------------------------------------------------------------------------------------


  useEffect(() => {    // Makes the db.json file correct when add new products, with update and adding product properly
    // Fetch all products and set the main product ID if it exists
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/animation");
        const existingProduct = response.data.find(
          (product) => product.anim_type === formData.anim_type
        );
        if (existingProduct) {
          setMainProductId(existingProduct.id);
        } else {
          setMainProductId(null);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    setIsAnimTypeSelected(!!formData.anim_type || formData.anim_cat.length < 0); // Set isAnimTypeSelected to true when the "Animation Type" is selected (give value to unlock disable attribute).
  }, [formData.anim_type, formData.anim_cat]);



  const handleChange = (e) => {   // To get the value and name from target inside console data
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setIsAnimTypeSelected(value !== "" || formData.anim_cat.length < 0); // Set isAnimTypeSelected to true when the "Animation Type" is selected (give value to unlock disable attribute).
  };


//---------------------------------------------------------------------------------------------------
  const handleSubCategoryChange = (e, index) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const newSubCategory = [...prevFormData.anim_cat];
      newSubCategory[index][name] = value;
      return {
        ...prevFormData,
        anim_cat: newSubCategory,
      };
    });
  };


  // const handleVideoUrlChange = (e, index) => {
  //   const { value } = e.target;
  //   setFormData((prevFormData) => {
  //     const newSubCategory = [...prevFormData.anim_cat];
  //     newSubCategory[index].video_url = value;
  //     return {
  //       ...prevFormData,
  //       anim_cat: newSubCategory,
  //     };
  //   });
  // };   // or
  const handleVideoUrlChange = (e, index) => {
    const { value } = e.target;
    handleSubCategoryChange({ target: { name: 'video_url', value } }, index);
  };
//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------
  const handleGenresChange = (e, genre, index) => {
    const isChecked = e.target.checked;
    setFormData((prevFormData) => {
      const newSubCategory = [...prevFormData.anim_cat];
      const targetSubCategory = newSubCategory[index]; // Get the sub-category object at the specified index
      const newGenres = isChecked
        ? [...targetSubCategory.genres, genre] // Add the genre to the genres array of the target sub-category
        : targetSubCategory.genres.filter((g) => g !== genre); // Remove the genre from the genres array of the target sub-category
      targetSubCategory.genres = newGenres; // Update the genres array of the target sub-category
      return {
        ...prevFormData,
        anim_cat: newSubCategory,
      };
    });
  };
  
  const handleTagsChange = (e, tag, index) => {
    const isChecked = e.target.checked;
    console.log("handleTagsChange:", tag, "Index:", index, "isChecked:", isChecked);

    setFormData((prevFormData) => {
      const newSubCategory = [...prevFormData.anim_cat];
      const targetSubCategory = newSubCategory[index]; // Get the sub-category object at the specified index
      const newTags = isChecked
        ? [...targetSubCategory.tags, tag] // Add the tag to the tags array of the target sub-category
        : targetSubCategory.tags.filter((g) => g !== tag); // Remove the tag from the tags array of the target sub-category
      targetSubCategory.tags = newTags; // Update the tags array of the target sub-category
      return {
        ...prevFormData,
        anim_cat: newSubCategory,
      };
    });
  };
//---------------------------------------------------------------------------------------------------


  const isSubProductComplete = (subProduct) => {   // To stop adding sub product without compleately filling the sub product form value.
    if (!subProduct) return false;

    const {
      anim_name, img_url, img_data, video_url, poster_img_url, poster_img_data, sub_cat, price, story, genres, release_date, duration, director, author, cast, tags, studio, rate,
    } = subProduct;

    return (
      anim_name?.trim() !== "" &&
      (img_url?.trim() !== "" || img_data) &&
      video_url?.trim() !== "" &&
      (poster_img_url?.trim() !== "" || poster_img_data) &&
      sub_cat?.trim() !== "" &&
      price?.trim() !== "" &&
      story?.trim() !== "" &&
      genres?.length > 0 &&
      release_date?.trim() !== "" &&
      duration?.trim() !== "" &&
      director?.trim() !== "" &&
      author?.trim() !== "" &&
      cast?.trim() !== "" &&
      tags?.length > 0 &&
      studio?.trim() !== "" &&
      rate?.trim() !== ""
    );
  };


  const handleAddSubCategory = () => {
    // Check if the last sub-product is not empty before adding a new one
    const lastSubProduct = formData.anim_cat[formData.anim_cat.length - 1];

    if (isSubProductComplete(lastSubProduct)) {

      const newSubProduct = {
        sub_id: `S${Date.now()}`,
        anim_name: "",
        img_url: "",
        img_data: null,
        video_url: "", 
        poster_img_url: "", 
        poster_img_data: null,
        sub_cat: "", price: "", story: "", 
        genres: [],
        release_date: "", duration: "", director: "", author: "", cast: "", 
        tags: [], 
        studio: "", rate: "",
      };
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        anim_cat: [...prevFormData.anim_cat, newSubProduct],
      }));
      
    } else {
      alert("Please fill out all the fields in the current sub-product before adding another.");
    }
  };


  const handleDeleteSubProduct = (index) => {
    setFormData((prevFormData) => {
      const newSubCategory = [...prevFormData.anim_cat];
      newSubCategory.splice(index, 1); // Remove the sub-product at the specified index
      return {
        ...prevFormData,
        anim_cat: newSubCategory,
      };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Data submit :", formData)

    // Send the formData to JSON server using Axios post request
    try {
      if (mainProductId) {    // Makes the db.json file correct when add new products, with update and adding product properly
        // If the main product exists, fetch its existing data
        const response = await axios.get(`http://localhost:5000/animation/${mainProductId}`);
        // console.log("The response:", response.data);
        const existingProduct = response.data;

        // Add the new sub-products to the existing product data
        const updatedProduct = {
          ...existingProduct,
          anim_cat: [...existingProduct.anim_cat, ...formData.anim_cat],
        };

        // Update the existing product with the new sub-products using the mainProductId
        await axios.put(`http://localhost:5000/animation/${mainProductId}`, updatedProduct);
      }
      else {
        // If the main product does not exist, add a new product
        const response = await axios.post("http://localhost:5000/animation", formData);
        console.log("Add res:", response.data);
      }

      // Reset the form data after successful submission
      setFormData({
        anim_type: "",
        anim_cat: [
          { sub_id: "", 
          anim_name: "", 
          img_url: "", 
          img_data: null, 
          video_url: "", 
          poster_img_url: "", 
          poster_img_data: null, 
          sub_cat: "", price: "", story: "", 
          genres: [], 
          release_date: "", duration: "", director: "", author: "", cast: "", 
          tags: [], 
          studio: "", rate: "",
          },
        ],
      });
      // Display success message after successful submission
      alert("Product Add Done");
      navigate('/admin/view');
    } 
    catch (error) {
      alert("Error to adding/updating product");
      console.error("Error adding/updating product:", error);
    }
  };



  return (
    <>
      {/* <div className="main-content" style={{marginTop: "67px"}}></div> */}
      <div className='wrap'>
        <h4>Add Your Products</h4>
        <div className='add'>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label> &nbsp;
                Animation Type:
                <select name="anim_type" value={formData.anim_type} required onChange={handleChange}>
                  <option value="" disabled > Select Animation Type </option>
                  <option value="Anime"> Anime </option>
                  <option value="2D Animation"> 2D Animation </option>
                  <option value="3D Animation"> 3D Animation </option>
                  <option value="Live Action & Animation"> Live Action and Animation </option>
                </select>
              </label>
            </div>
            <br />

            <fieldset  disabled={!isAnimTypeSelected}>
            <legend>{formData.anim_type}</legend>

            {formData.anim_cat.map((subProduct, index) => (
              <div key={index}>


                <div className="form-group">
                  <label> &nbsp;
                    Animation Name:
                    <input type="text" name="anim_name" value={subProduct.anim_name || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} />
                  </label>
                  <br />

                  <label className="fix-margin"> &nbsp;
                    Banner Image:
                    <div className="radio-group">
                      <input type="radio" name={`imgType-${index}`} value="url" checked={bannerImageType[index] === "url"} onChange={() => handleBannerImageTypeChange(index, "url")} />
                      <label htmlFor={`imgType-${index}`}> Image URL </label>
                    
                      <input type="radio" name={`imgType-${index}`} value="file" checked={bannerImageType[index] === "file"} onChange={() => handleBannerImageTypeChange(index, "file")} />
                      <label htmlFor={`imgType-${index}`}> Upload Image </label>
                    </div>
                    {bannerImageType[index] === "url" ? (
                      <input type="text" name="img_url" value={subProduct.img_url || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} disabled={bannerImageType[index] !== "url"} />
                    ) : (
                      <input type="file" accept="image/*" required  onChange={(e) => handleImageChange(e, index)} disabled={bannerImageType[index] !== "file"} />
                    )}
                  </label>
                  <br />
                </div>


                <div className="form-group">
                  <label> &nbsp;
                    Video URL:
                    <input type="text" name="video_url" value={subProduct.video_url || ""} required onChange={(e) => handleVideoUrlChange(e, index)} />
                  </label>
                  <br />

                  <label className="fix-margin"> &nbsp;
                    Poster Image:
                    <div className="radio-group">
                      <input type="radio" name={`posterImgType-${index}`} value="url" checked={posterImageType[index] === "poster_url"} onChange={() => handlePosterImageTypeChange(index, "poster_url")} />
                      <label htmlFor={`posterImgType-${index}`}> Image URL </label>
                    
                      <input type="radio" name={`posterImgType-${index}`} value="file" checked={posterImageType[index] === "poster_file"} onChange={() => handlePosterImageTypeChange(index, "poster_file")} />
                      <label htmlFor={`posterImgType-${index}`}> Upload Image </label>
                    </div>
                    {posterImageType[index] === "poster_url" ? (
                      <input type="text" name="poster_img_url" value={subProduct.poster_img_url || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} disabled={posterImageType[index] !== "poster_url"} />
                    ) : (
                      <input type="file" accept="image/*" required  onChange={(e) => handlePosterImageChange(e, index)} disabled={posterImageType[index] !== "poster_file"} />
                    )}
                  </label>
                  <br />
                </div>


                <div className="form-group">
                  <label> &nbsp;
                    Sub Category:
                    <div className="radio-group">
                      <input type="radio" name="sub_cat" value="Film" checked={subProduct.sub_cat === "Film"} required  onChange={(e) => handleSubCategoryChange(e, index)} />
                      <label htmlFor={`sub_cat`}>Film</label>
                      <input type="radio" name="sub_cat" value="Television Series" checked={subProduct.sub_cat === "Television Series"} required  onChange={(e) => handleSubCategoryChange(e, index)} />
                      <label htmlFor={`sub_cat`}>Television Series</label>
                    </div>
                  </label>
                  <br />

                  <label> &nbsp;
                    Price:
                    <input type="number" name="price" value={subProduct.price || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} />
                  </label>
                  <br />

                  <label> &nbsp;
                    Story:
                    <textarea name="story" value={subProduct.story || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} style={{width:"100%"}}/>
                  </label>
                  <br />
                </div>

                
                <div className="form-group">
                  <label> &nbsp;
                    Genres:
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Family" checked={subProduct.genres.includes("Family")}   onChange={(e) => handleGenresChange(e, "Family", index)} />
                      <label htmlFor={`genres`}>Family</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Kids" checked={subProduct.genres.includes("Kids")}  onChange={(e) => handleGenresChange(e, "Kids", index)} />
                      <label htmlFor={`genres`}>Kids</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Cartoon" checked={subProduct.genres.includes("Cartoon")}  onChange={(e) => handleGenresChange(e, "Cartoon", index)} />
                      <label htmlFor={`genres`}>Cartoon</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Comedy" checked={subProduct.genres.includes("Comedy")}  onChange={(e) => handleGenresChange(e, "Comedy", index)} />
                      <label htmlFor={`genres`}>Comedy</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Drama" checked={subProduct.genres.includes("Drama")}  onChange={(e) => handleGenresChange(e, "Drama", index)} />
                      <label htmlFor={`genres`}>Drama</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Slice of Life" checked={subProduct.genres.includes("Slice of Life")}  onChange={(e) => handleGenresChange(e, "Slice of Life", index)} />
                      <label htmlFor={`genres`}>Slice of Life</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Adventure" checked={subProduct.genres.includes("Adventure")}  onChange={(e) => handleGenresChange(e, "Adventure", index)} />
                      <label htmlFor={`genres`}>Adventure</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Fantasy" checked={subProduct.genres.includes("Fantasy")}  onChange={(e) => handleGenresChange(e, "Fantasy", index)} />
                      <label htmlFor={`genres`}>Fantasy</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Magic" checked={subProduct.genres.includes("Magic")}  onChange={(e) => handleGenresChange(e, "Magic", index)} />
                      <label htmlFor={`genres`}>Magic</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Supernatural" checked={subProduct.genres.includes("Supernatural")}  onChange={(e) => handleGenresChange(e, "Supernatural", index)} />
                      <label htmlFor={`genres`}>Supernatural</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Mystery" checked={subProduct.genres.includes("Mystery")}  onChange={(e) => handleGenresChange(e, "Mystery", index)} />
                      <label htmlFor={`genres`}>Mystery</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="genres" value="Romance" checked={subProduct.genres.includes("Romance")}  onChange={(e) => handleGenresChange(e, "Romance", index)} />
                      <label htmlFor={`genres`}>Romance</label>
                    </div>
                  </label>
                  <br />
                </div>                


                <div className="form-group">
                  <label> &nbsp;
                    Release Date:
                    <input type="date" name="release_date" value={subProduct.release_date || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} />
                  </label>
                  <br />
                  <label> &nbsp;
                    Duration/Season:
                    <input type="text" name="duration" value={subProduct.duration || ""} placeholder="Example: 1h 60m / 2 Seasons" required  onChange={(e) => handleSubCategoryChange(e, index)} />
                  </label>
                  <br />
                </div>

                
                <div className="form-group">
                  <label> &nbsp;
                    Director:
                    <input type="text" name="director" value={subProduct.director || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} />
                  </label>
                  <br />
                  <label> &nbsp;
                    Author:
                    <input type="text" name="author" value={subProduct.author || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} />
                  </label>
                  <br />
                  <label> &nbsp;
                    Cast:
                    <textarea name="cast" value={subProduct.cast || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} style={{width:"100%"}}/>
                  </label>
                  <br />
                </div>


                <div className="form-group">
                  <label> &nbsp;
                    Tags:
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Latest" checked={subProduct.tags.includes("Latest")}   onChange={(e) => handleTagsChange(e, "Latest", index)} />
                      <label htmlFor={`tags`}>Latest</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Trending" checked={subProduct.tags.includes("Trending")}  onChange={(e) => handleTagsChange(e, "Trending", index)} />
                      <label htmlFor={`tags`}>Trending</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Classic" checked={subProduct.tags.includes("Classic")}  onChange={(e) => handleTagsChange(e, "Classic", index)} />
                      <label htmlFor={`tags`}>Classic</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Iconic" checked={subProduct.tags.includes("Iconic")}  onChange={(e) => handleTagsChange(e, "Iconic", index)} />
                      <label htmlFor={`tags`}>Iconic</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Top Rated" checked={subProduct.tags.includes("Top Rated")}  onChange={(e) => handleTagsChange(e, "Top Rated", index)} />
                      <label htmlFor={`tags`}>Top Rated</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Award Winning" checked={subProduct.tags.includes("Award Winning")}  onChange={(e) => handleTagsChange(e, "Award Winning", index)} />
                      <label htmlFor={`tags`}>Award Winning</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Ghibli" checked={subProduct.tags.includes("Ghibli")}  onChange={(e) => handleTagsChange(e, "Ghibli", index)} />
                      <label htmlFor={`tags`}>Ghibli</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Disney" checked={subProduct.tags.includes("Disney")}  onChange={(e) => handleTagsChange(e, "Disney", index)} />
                      <label htmlFor={`tags`}>Disney</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Ongoing" checked={subProduct.tags.includes("Ongoing")}  onChange={(e) => handleTagsChange(e, "Ongoing", index)} />
                      <label htmlFor={`tags`}>Ongoing</label>
                    </div>
                    <div className="checkbox-group">
                      <input type="checkbox" name="tags" value="Coming Soon" checked={subProduct.tags.includes("Coming Soon")}  onChange={(e) => handleTagsChange(e, "Coming Soon", index)} />
                      <label htmlFor={`tags`}>Coming Soon</label>
                    </div>
                  </label>
                  <br />
                </div>


                <div className="form-group">
                  <label> &nbsp;
                    Studio:
                    <input type="text" name="studio" value={subProduct.studio || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} />
                  </label>
                  <br />
                  <label> &nbsp;
                    Rate: {subProduct.rate}
                    <input type="range" name="rate" min="0" max="10" step="0.1" value={subProduct.rate || ""} required  onChange={(e) => handleSubCategoryChange(e, index)} />
                  </label>
                  <br />
                </div>
                

                {formData.anim_cat.length > 1 && (
                  <div className="div-bt">
                    <CustomTooltip title="Delete" placement="left" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow>
                      <button type="button" className="react-icons btn-ico" onClick={() => handleDeleteSubProduct(index)}>
                        <FaTrashAlt/>
                      </button>
                    </CustomTooltip>
                  </div>
                )}

              </div>
            ))}

            <div className="div-bt div-btfx">
              <CustomTooltip title="Add" placement="left" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow>
                <button type="button" className="react-icons btn-ico" onClick={handleAddSubCategory}>
                  <MdAddToPhotos/>
                </button>
              </CustomTooltip>
            </div>

            </fieldset>
            <br />

            <button type="submit" className="mainbtn">
              {formData.anim_cat.every(isSubProductComplete) ? "Submit" : "Add Product"}
            </button>
            
          </form>

        </div>
      </div>
    </>
  );
};

export default Add;
