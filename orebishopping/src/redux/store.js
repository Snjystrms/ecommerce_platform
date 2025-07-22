import { configureStore } from "@reduxjs/toolkit";
import orebiReducer from "./orebiSlice";

// Get initial user info from localStorage if available
const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      return {
        user: JSON.parse(user),
        jwt: token
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const store = configureStore({
  reducer: {
    orebi: orebiReducer,
  },
  preloadedState: {
    orebi: {
      userInfo: getUserFromLocalStorage(),
      products: [],
      cart: null,
      cartItems: [],
    }
  }
});

export default store;
