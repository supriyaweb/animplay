import React, { useEffect, useState } from 'react'
import './Edit.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import imageCompression from 'browser-image-compression';
// npm install browser-image-compression



const Edit = () => {

  let navigate = useNavigate();

  let {id, eid} = useParams();
  console.log("Main Product ID:", id);
  console.log("Specific Sub-Product ID:", eid);


  let [edited, setEdited] = useState({
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

  const [mainProductId, setMainProductId] = useState(null); // State to get main product ID when necessary.
  

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



  useEffect(() => {
    // Fetch the main product to access the anim_type
    axios.get(`http://localhost:5000/animation/${id}`)
      .then((res) => {
        console.log("Fetched Single Product :", res.data);
        // To find the sub-product that matches the provided eid
        const subProduct = res.data.anim_cat.find(sub => sub.sub_id === eid);

        // To set the edited state with the found sub-product
        setEdited({
          anim_type: res.data.anim_type,
          anim_cat: [subProduct],
        });
      })
      .catch((err) => {
        console.log("Error to Fetched Single Product :", err);
        alert("Unable to find the product");
      });

  }, [id, eid]);


  useEffect(() => {    // To find ID from the main localhost:5000/animation and get it, when it is needed to add product inside other anim_type.
    // Fetch all products and set the main product ID if it exists
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/animation");
        const mainExistingProduct = response.data.find(
          (product) => product.anim_type === edited.anim_type
        );
        if (mainExistingProduct) {
          setMainProductId(mainExistingProduct.id);
        } else {
          setMainProductId(null);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [edited.anim_type]);


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
      const newSubCategory = [...edited.anim_cat];
      newSubCategory[index].img_url = "";

      // Set img_data with the new image
      newSubCategory[index].img_data = compressedBase64;

      setEdited((prevFormData) => ({
        ...prevFormData,
        anim_cat: newSubCategory,
      }));
      
    } catch (error) {
      console.error('Error handling image:', error);
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
  
      const newSubCategory = [...edited.anim_cat];
      newSubCategory[index].poster_img_url = "";
      newSubCategory[index].poster_img_data = compressedBase64;

      setEdited((prevFormData) => ({
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
  

  const handleChange = (e) => {   // To get the value and name from target inside console data
    const { name, value } = e.target;
    console.log("handleChange:", name, value);
    
    setEdited((prevedited) => ({
      ...prevedited,
      [name]: value,
    }));
  };


//---------------------------------------------------------------------------------------------------
  const handleSubCategoryChange = (e, index) => {
    const { name, value } = e.target;
    console.log("handleSubCategoryChange:", name, value, "Index:", index);

    setEdited((prevEdited) => {
      const newAnimCat = prevEdited.anim_cat.map((subProduct, subIndex) => {
        if (subIndex === index) {
          return {
            ...subProduct,
            [name]: value,   // Update only the specific field in the sub-product
          };
        }
        return subProduct;    // Keep the other sub-products unchanged
      });
      return {
        ...prevEdited,
        anim_cat: newAnimCat,   // Update only the anim_cat array with modified sub-products
      };
    });
  };


  const handleVideoUrlChange = (e, index) => {
    const { value } = e.target;
    handleSubCategoryChange({ target: { name: 'video_url', value } }, index);
  };
//---------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------
  const handleGenresChange = (e, genre, index) => {
    const isChecked = e.target.checked;
    console.log("handleGenresChange:", genre, "Index:", index, "isChecked:", isChecked);

    setEdited((prevedited) => {
      const newAnimCat = [...prevedited.anim_cat];
      const targetSubCategory = newAnimCat[index]; // Get the sub-category object at the specified index
      const newGenres = isChecked
      ? [...targetSubCategory.genres, genre] // Add the genre to the genres array of the target sub-category
        : targetSubCategory.genres.filter((g) => g !== genre); // Remove the genre from the genres array of the target sub-category
      targetSubCategory.genres = newGenres; // Update the genres array of the target sub-category
      return {
        ...prevedited,
        anim_cat: newAnimCat,
      };
    });
  };

  const handleTagsChange = (e, tag, index) => {
    const isChecked = e.target.checked;
    console.log("handleTagsChange:", tag, "Index:", index, "isChecked:", isChecked);

    setEdited((prevFormData) => {
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



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Data submit :", edited);
  
    // axios.put(`http://localhost:5000/animation/${id}`, {
    //   anim_type: edited.anim_type,
    //   anim_cat: [edited.anim_cat[0]],
    // })
    // axios.put(`http://localhost:5000/animation/${id}`, edited)
    // .then((response) => {
    //   alert("Product Edited Successfully");
    //   console.log("Data Edited");

    //   navigate(`/view/detail/${id}/${eid}`);
    // })
    // .catch((error) => {
    //   alert("Product Error to Edit");
    //   console.log("Error to Edit");
    // });

    // try {
    //   await axios.put(`http://localhost:5000/animation/${id}`, edited);
    //   alert("Product Edited Successfully");
    //   console.log("Data Edited");

    //   navigate(`/view/detail/${id}/${eid}`);
    // } catch (err) {
    //   alert("Product Error to Edit");
    //   console.log("Error to Edit");
    // }


    try {
      // Fetch the existing product data
      const response = await axios.get(`http://localhost:5000/animation/${id}`);
      const existingProduct = response.data;
      // console.log("Data in existingProduct :", existingProduct);

      // Find the index of the sub-product to be updated
      const subProductIndex = existingProduct.anim_cat.findIndex(
        (sub) => sub.sub_id === eid
      );
      // console.log("Data in subProductIndex :", subProductIndex);   // The product that I opened in edit page


      if (subProductIndex !== -1) {
        // Update the specific sub-product in the array
        const editedCat = edited.anim_cat[0];   // The edited product when data is submitted
        // console.log("Data in editedCat :", editedCat);
        existingProduct.anim_cat[subProductIndex] = editedCat;
        

        // Check if the anim_type has changed
        if (existingProduct.anim_type !== edited.anim_type) {
          
          const splicedSubProduct = existingProduct.anim_cat[subProductIndex];    // Store the sub-product to be spliced

          // Remove the sub-product from the old anim_type
          existingProduct.anim_cat.splice(subProductIndex, 1);

          // Send the updated product to the server (without the spliced sub-product)
          await axios.put(`http://localhost:5000/animation/${id}`, existingProduct);    // *Edit to remove(splice) the same product from edited anim_type. Which will add below inside new anim_type


          if (mainProductId) {    // Add product with put to the new selected anim_type. make the product inside that anim_type in db.json file. concept similar used in Add.jsx.
            // Fetch the main product data
            const mainResponse  = await axios.get(`http://localhost:5000/animation/${mainProductId}`);
            // console.log("The mainResponse :", mainResponse .data);
            const mainExistingProduct = mainResponse.data;

            // Add the new sub-products to the existing product data
            // const updatedProduct = {
            //   ...mainExistingProduct,
            //   anim_cat: [...mainExistingProduct.anim_cat, editedCat],
            // };

            //or- above or below push
            // Add the spliced sub-product to the new anim_type
            mainExistingProduct.anim_cat.push(splicedSubProduct);
    
            // Update the existing product with the new sub-product using the mainProductId
            await axios.put(`http://localhost:5000/animation/${mainProductId}`, mainExistingProduct);   // *Edit to add product inside the new anim_type

            alert("Product Edited Successfully");
            navigate(`/admin/view/detail/${mainProductId}/${eid}`);

          } else {
            navigate(`/admin/view/detail/${id}/${eid}`);
          }

        } else {
          // Send the updated product to the server (when anim_type is not changed)
          await axios.put(`http://localhost:5000/animation/${id}`, existingProduct);
    
          alert("Product Edited Successfully");
          // console.log("Data Edited");
          navigate(`/admin/view/detail/${id}/${eid}`);
        }

      } else {
        alert("Sub-Product Not Found");
      }

    } catch (err) {
      alert("Product Error to Edit");
      console.log("Error to Edit");
    }
    
  };




  return (
    <div>
      <div className="main-content" style={{marginTop: "67px"}}></div>
      <div className='edit-wrap'>
        <div className='wrap'>
          <h4>Edit Your Products</h4>
          <div className='add'>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label> &nbsp;
                  Animation Type:
                  <select name="anim_type" value={edited.anim_type} required onChange={handleChange}>
                    <option value="" disabled > Select Animation Type </option>
                    <option value="Anime"> Anime </option>
                    <option value="2D Animation"> 2D Animation </option>
                    <option value="3D Animation"> 3D Animation </option>
                    <option value="Live Action & Animation"> Live Action and Animation </option>
                  </select>
                </label>
              </div>
              <br />

              <fieldset>
              <legend>{edited.anim_type}</legend>

              {edited.anim_cat.map((subProduct, index) => (
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
                </div>
              ))}

              </fieldset>
              <br />

              <button type="submit" className="mainbtn">
                Edit Product
              </button>
              
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Edit