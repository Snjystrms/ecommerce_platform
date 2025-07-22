import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { strapiApi } from "../api/strapi";

const initialState = {
  userInfo: null,
  products: [],
  // New cart state
  cart: null, // Will hold the entire cart object from the backend
  cartItems: [], // Will hold just the items for UI consistency
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // This reducer will now just update the local state.
      // The API calls will be handled in the component.
      const item = state.cartItems.find(
        (item) => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity++;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.productId === action.payload.productId
      );
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== action.payload
      );
    },
    resetCart: (state) => {
      state.cartItems = [];
      if (state.cart) {
        strapiApi.updateCart(state.cart.id, { data: { cartItems: [] } })
          .catch(err => console.error("Failed to clear cart in DB:", err));
      }
    },
    // User authentication
    addUser: (state, action) => {
      state.userInfo = action.payload;
    },
    removeUser: (state) => {
      state.userInfo = null;
      state.cart = null;
      state.cartItems = [];
    },
    // New actions for DB-backed cart
    setCartFromDB: (state, action) => {
      state.cart = action.payload;
      state.cartItems = action.payload.attributes.cartItems || [];
    },
    clearCart: (state) => {
      state.cart = null;
      state.cartItems = [];
    }
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  resetCart,
  addUser,
  removeUser,
  setCartFromDB,
  clearCart,
} = orebiSlice.actions;
export default orebiSlice.reducer;
