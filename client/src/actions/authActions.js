import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";
// Register User
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => {
      // Save to localStorage
      //console.log(res);
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("fname", userData.fname);

      localStorage.setItem("email", userData.email);
      localStorage.setItem("cell", userData.cell);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};
// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      // Save to localStorage
      //console.log(res);
      // Set token to localStorage
      const { token, cell, fname } = res.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("fname", fname);

      localStorage.setItem("cell", cell);
      //localStorage.setItem("email", userData.email);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      //console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
    });
};
// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};
// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("email");
  localStorage.removeItem("cell");

  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
