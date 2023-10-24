import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


let api_url= "http://localhost:5000/animation"


export const fetchAllProd= createAsyncThunk("anim/fetchAllProd",
async()=>{
    const res= await axios.get(api_url)
    
    console.log('fetchAllProd Response:', res.data); // Log response
    return res?.data;
});


export const fetchDetailProd = createAsyncThunk("anim/fetchDetailProd", 
async (details) => {
    // console.log("Received parameter: ",details.id,details.dm);
    const res = await axios.get(`${api_url}/${details.id}`);

    // console.log('fetchDetailProd Response:', res.data); // Log response

    const mainProduct = res.data; // Get the main product object
    const single = mainProduct.anim_cat.find((x) => x.sub_id === details.dm);

    // console.log('fetchDetailProd new Response:', single);

    return single;
});




export const fetchProducts = () => {
    return async (dispatch) => {
      try {
        // Make an API call or fetch the products in some way
        const res = await axios.get(api_url);
        const products = res.data; // Assuming the response contains the products
  
        dispatch(setAllProducts(products));
      } catch (error) {
        // Handle errors
        console.error('Error fetching products:', error);
      }
    };
};




const initial_value = {
    allProducts: [],     // Store the list of all products
    selectedProduct: {}, // Store the details of the selected product
    isLoading: false,
    error: null,
};

export const productSlice=createSlice({
    name:'anim',
    initialState: initial_value,
    //work as middleware for handling asyncronous action

    reducers: {
        setAllProducts: (state, action) => {
            state.allProducts = action.payload;
        },
    },


    extraReducers:(builder)=>{

        builder.addCase(fetchAllProd.pending, (state,action)=>{
            console.log("Action: ", action);
            state.isLoading=true;
        })
        builder.addCase(fetchAllProd.fulfilled, (state,action)=>{
            console.log("Action: ", action);
            state.isLoading=false;
            state.allProducts=action.payload;
            state.error=null;
        })
        builder.addCase(fetchAllProd.rejected, (state,action)=>{
            console.log("Action: ", action);
            state.isLoading=false;
            state.allProducts=[];
            state.error=action.error.message;
        })


        builder.addCase(fetchDetailProd.pending, (state,action)=>{
            console.log("Action: ", action);
            state.isLoading=true;
        })
        builder.addCase(fetchDetailProd.fulfilled, (state,action)=>{
            console.log("Action: ", action);
            state.isLoading=false;
            state.selectedProduct=action.payload;
            state.error=null;
        })
        builder.addCase(fetchDetailProd.rejected, (state,action)=>{
            console.log("Action: ", action);
            state.isLoading=false;
            state.selectedProduct={};
            state.error=action.error.message;
        })
    }
})


export const { setAllProducts } = productSlice.actions;

export default productSlice.reducer;