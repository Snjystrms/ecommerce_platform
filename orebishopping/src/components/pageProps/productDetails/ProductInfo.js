import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { strapiApi } from "../../../api/strapi";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  const { userInfo, cart, cartItems } = useSelector((state) => state.orebi);

  const handleAddToCart = async () => {
    // This is the new, more complex logic for a DB-backed cart.
    const productToAdd = {
      productId: productInfo.id,
      quantity: 1,
      name: productInfo.name,
      price: productInfo.price,
      image: productInfo.image,
    };

    let updatedCartItems = [...cartItems];
    const existingItem = updatedCartItems.find(item => item.productId === productInfo.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCartItems.push(productToAdd);
    }

    if (userInfo && userInfo.user) {
      // User is logged in, sync with DB
      const payload = { data: { cartItems: updatedCartItems } };
      try {
        if (cart) {
          // Cart exists, update it
          await strapiApi.updateCart(cart.id, payload);
        } else {
          // No cart, create one
          const createPayload = {
            data: {
              ...payload.data,
              user: userInfo.user.id
            }
          };
          await strapiApi.createCart(createPayload);
        }
        // Finally, update local state
        dispatch(addToCart(productToAdd));
      } catch (error) {
        console.error("Failed to sync cart with DB:", error);
      }
    } else {
      // User is not logged in, just update local state
      dispatch(addToCart(productToAdd));
    }
  };


  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.name}</h2>
      <p className="text-xl font-semibold">${productInfo.price}</p>
      <p className="text-base text-gray-600">{productInfo.description}</p>
      <p className="text-sm text-gray-500">Be the first to leave a review.</p>
      <button
        onClick={handleAddToCart}
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Add to Cart
      </button>
      <p className="font-normal text-sm">
        <span className="text-base font-medium"> Categories:</span> Spring,
        Street, Women
      </p>
    </div>
  );
};

export default ProductInfo;
