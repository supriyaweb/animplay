import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { createAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';


let reg_api = "https://wtsacademy.dedicateddevelopers.us/api/user/signup"
let sign_api = "https://wtsacademy.dedicateddevelopers.us/api/user/signin"
let prof_api = "https://wtsacademy.dedicateddevelopers.us/api/user/profile-details"


const initial_value = {
    isLoading: false,
    error: null,
    // api parameters
    status: 0,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    profile_pic: "",
    // user define variables
    message: "",
    errMsg: "",
    authenticated: false,
    authToken: "",
};


export const Sign_Up= createAsyncThunk("auth/Sign_Up", async(userdata)=>{
    try {
        const res = await axios.post(reg_api, userdata, {
          headers: {
            "Content-Type": "application/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        });
        return res?.data;
    }
    catch (error) {
        throw error;
    }
});


export const Sign_In = createAsyncThunk("auth/Sign_In", async (userdata) => {
    try {
        const res = await axios.post(sign_api, userdata, {
        headers: {
            "Content-Type": "application/form-data",
            "Access-Control-Allow-Origin": "*",
        },
        });
        return res?.data;
    } 
    catch (error) {
        throw error;
    }
});


export const viewProfile = createAsyncThunk("auth/viewProfile", async () => {
    let authToken = window.localStorage.getItem("token");
    try {
    const res = await axios.get(prof_api, {
      headers: {
        "x-access-token": authToken,
        "Content-Type": "application/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    });
        return res?.data;
    } 
    catch (error) {
        throw error;
    }
});


export const AdminData = createAsyncThunk("auth/AdminData", async () => {
    let authToken = window.sessionStorage.getItem("token");
    try {
    const res = await axios.get(prof_api, {
      headers: {
        "x-access-token": authToken,
        "Content-Type": "application/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    });
        return res?.data;
    } 
    catch (error) {
        throw error;
    }
});



// logout action using createAction
// export const logoutAction = createAction("auth/logout");



export const AuthSlice=createSlice({
    name:'auth',
    initialState: initial_value,
    //work as middleware for handling asyncronous action

    reducers: {
        Sign_Out: (state) => {
            state.authenticated = false;
            state.authToken = "";
            state.email = ""; // Clear the stored email on sign out
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("email");
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("email");
        },
    },


    extraReducers:(builder)=>{

        builder.addCase(Sign_Up.pending, (state,action)=>{
            console.log("Action: ", action);
            state.isLoading=true;
        })

        builder.addCase(Sign_Up.fulfilled, (state,action)=>{
            console.log("Action: ", action);

            if(action.payload.status===200){
                state.isLoading=false;
                state.status=action.payload.status;
                state.first_name=action.payload.data.first_name;
                state.last_name=action.payload.data.last_name;
                state.email=action.payload.data.email;
                state.message=action.payload.message;

                // console.log("Action: ", action);
                toast("🦄 Hello "+state.first_name+" "+state.last_name+"\n"+state.message+", for email address: "+state.email)
            }
            else{
                state.status = action.payload.status;
                state.errMsg = action.payload.data.message;
                toast(action.payload.data.message+"\n\nNot Done");
                // alert("Not Done");
            }
        })

        builder.addCase(Sign_Up.rejected, (state,action)=>{
            // console.log("Action: ", action);
            state.isLoading=false;
            state.error=action.error.message;
            console.log("Action: ", action);
        })



        builder.addCase(Sign_In.pending, (state,action)=>{
            console.log("Action: ", action);
            // Set isLoading to true when the Sign_In request is pending
            state.isLoading = true;
            state.error = null; // Clear any previous errors
        })

        builder.addCase(Sign_In.fulfilled, (state,action)=>{
            console.log("Action: ", action);
            state.isLoading = false;

            // Check if the signed-in email is the specific admin email
            const isAdminEmail = action.payload.data.email === 'adminsupriya@gmail.com';

            if (action.payload.status === 200) {
                // Handle successful sign-in
                state.status = action.payload.status;
                state.email = action.payload.data.email;
                state.message = action.payload.message;
                state.authenticated = true;

                console.log(action.payload.token) // checking token data
                
                // Store the auth token and email based on user type
                if (isAdminEmail) {
                    // Admin - store in session storage
                    window.sessionStorage.setItem("token", action.payload.token);
                    window.sessionStorage.setItem("email", action.payload.data.email);
                } else {
                    // User - store in local storage
                    window.localStorage.setItem("token", action.payload.token);
                    window.localStorage.setItem("email", action.payload.data.email);
                }

                console.log(window.sessionStorage.getItem("token")); // checking token data
                console.log(window.sessionStorage.getItem("email")); // checking email data
                console.log(window.localStorage.getItem("token")); // checking token data
                console.log(window.localStorage.getItem("email")); // checking email data

                toast("🦄 Hello "+state.first_name+"\nYou are LoggedIn")

                // Handle any other state updates need for a successful sign-in
            } else {
                // Handle the case where the sign-in was not successful
                state.status = action.payload.status;
                state.errMsg = action.payload.data.message;
                toast(action.payload.data.message+"\n\nTry Again");
            }
        });

        builder.addCase(Sign_In.rejected, (state,action)=>{
            // console.log("Action: ", action);
            state.isLoading=false;
            state.error=action.error.message;
            console.log("Action: ", action);
        })



        builder.addCase(viewProfile.pending, (state, action) => {
            console.log("Action: ", action);
            // Set isLoading to true when the viewProfile request is pending
            state.isLoading = true;
            state.error = null; // Clear any previous errors
        });

        builder.addCase(viewProfile.fulfilled, (state, action) => {
            console.log("Action: ", action);
            // Set isLoading to false when the request is fulfilled (regardless of success or failure)
            state.isLoading = false;

            //for image
            let base_url = "https://wtsacademy.dedicateddevelopers.us/";
            let folder_path = "uploads/user/profile_pic/";
            let img_url = base_url + folder_path + action.payload.data.profile_pic;
            console.log("Image_url: ", img_url);
      
            if (action.payload.status === 200) {
              // Handle successful profile view
              state.status = action.payload.status;
              state.first_name = action.payload.data.first_name;
              state.last_name = action.payload.data.last_name;
              state.email = action.payload.data.email;
              state.profile_pic = img_url;
              state.message = action.payload.message;
      
              // Handle any other state updates need for a successful profile view
            } else {
              // Handle the case where the profile view was not successful
              state.status = action.payload.status;
              state.errMsg = action.payload.data.message;
      
              // Handle any other state updates need for a failed profile view
            }
        });

        builder.addCase(viewProfile.rejected, (state, action) => {
            // Handle profile view rejection (request failed, network error, etc.)
            console.log("Action: ", action);
            state.isLoading = false;
            state.error = action.error.message;

            // Handle any other state updates need for a rejected profile view
        });
        
        
        
        builder.addCase(AdminData.pending, (state, action) => {
            console.log("Action: ", action);
            // Set isLoading to true when the AdminData request is pending
            state.isLoading = true;
            state.error = null; // Clear any previous errors
        });

        builder.addCase(AdminData.fulfilled, (state, action) => {
            console.log("Action: ", action);
            // Set isLoading to false when the request is fulfilled (regardless of success or failure)
            state.isLoading = false;

            //for image
            let base_url = "https://wtsacademy.dedicateddevelopers.us/";
            let folder_path = "uploads/user/profile_pic/";
            let img_url = base_url + folder_path + action.payload.data.profile_pic;
            console.log("Image_url: ", img_url);
      
            if (action.payload.status === 200) {
              // Handle successful profile view
              state.status = action.payload.status;
              state.first_name = action.payload.data.first_name;
              state.last_name = action.payload.data.last_name;
              state.email = action.payload.data.email;
              state.profile_pic = img_url;
              state.message = action.payload.message;
      
              // Handle any other state updates need for a successful profile view
            } else {
              // Handle the case where the profile view was not successful
              state.status = action.payload.status;
              state.errMsg = action.payload.data.message;
      
              // Handle any other state updates need for a failed profile view
            }
        });

        builder.addCase(AdminData.rejected, (state, action) => {
            // Handle profile view rejection (request failed, network error, etc.)
            console.log("Action: ", action);
            state.isLoading = false;
            state.error = action.error.message;

            // Handle any other state updates need for a rejected profile view
        });



        // builder.addCase(Sign_Out, (state) => {
        //     state.authenticated = false;
        //     state.authToken = "";
        //     state.email = ""; // Clear the stored email on sign out
        //     window.sessionStorage.removeItem("token");
        //     window.sessionStorage.removeItem("email");
        //     window.localStorage.removeItem("token");
        //     window.localStorage.removeItem("email");
        //   });



        // builder.addCase(logoutAction, (state) => {
        //     state.authenticated = false;
        //     state.authToken = "";
        //     window.localStorage.removeItem("token");
        // });

    }
})


// reducers logout action
export const { Sign_Out } = AuthSlice.actions;

export default AuthSlice.reducer;
