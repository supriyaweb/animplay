import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const reviewUrl = 'http://localhost:5000/review';

export const addReview = createAsyncThunk('reviews/addReview', async (reviewData) => {
  const response = await axios.post(reviewUrl, reviewData);
  return response.data;
});


export const fetchReview= createAsyncThunk("reviews/fetchReview", async(reviewsData) => {
    const res= await axios.get(reviewUrl, reviewsData);
    
    console.log('fetchAllReview Response:', res.data); // Log response
    return res?.data;
})


export const editReview = createAsyncThunk('reviews/editReview', async ({ id, updatedReview }) => {
  const response = await axios.put(`${reviewUrl}/${id}`, updatedReview);
  return response.data;
});

export const deleteReview = createAsyncThunk('reviews/deleteReview', async (id) => {
  await axios.delete(`${reviewUrl}/${id}`);
  return id;
});



const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
      reviews: [], // initial state for reviews
      reviewFetch: [],
      status: 'idle',
      error: null,
    },

    reducers: {
      // Other reducers for managing reviews (e.g., update, delete)
    },

    extraReducers: (builder) => {

      builder
        .addCase(addReview.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(addReview.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.reviews.push(action.payload); // Assuming the payload is the new review data
        })
        .addCase(addReview.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });


        builder.addCase(fetchReview.pending, (state,action)=>{
            console.log("Action: ", action);
            state.status = 'loading';
        })
        builder.addCase(fetchReview.fulfilled, (state,action)=>{
            console.log("Action: ", action);
            state.status = 'succeeded';
            state.reviewFetch=action.payload;
            state.error=null;
        })
        builder.addCase(fetchReview.rejected, (state,action)=>{
            console.log("Action: ", action);
            state.status = 'failed';
            state.reviewFetch=[];
            state.error=action.error.message;
        });


        builder
        .addCase(editReview.fulfilled, (state, action) => {
          const updatedReview = action.payload;
          state.reviews = state.reviews.map(review => review.id === updatedReview.id ? updatedReview : review);
          state.status = 'succeeded';
        })
        .addCase(deleteReview.fulfilled, (state, action) => {
          const deletedReviewId = action.payload;
          state.reviews = state.reviews.filter(review => review.id !== deletedReviewId);
          state.status = 'succeeded';
        });
    },
});
  
export default reviewsSlice.reducer;
