import { configureStore } from "@reduxjs/toolkit";
import animReducer from "../AllSlices/AnimSlice";
import reviewsReducer from "../AllSlices/ReviewSlice";
import AuthReducer from "../AllSlices/AuthSlice";


const Store = configureStore({
    reducer:{
        anim: animReducer,
        reviews: reviewsReducer,
        auth: AuthReducer
    }
})

export default Store;