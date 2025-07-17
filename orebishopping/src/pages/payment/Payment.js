import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetCart } from "../../redux/orebiSlice";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRazorpayPayment = async () => {
    const amount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      setErrorMsg("Razorpay SDK failed to load. Are you online?");
      return;
    }
    try {
      // Call backend to create Razorpay order
      const response = await fetch("http://localhost:1337/api/orders/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      const orderDetails = {
        id: data.id,
        total: amount,
        orderItems: products,
        customerName: userInfo?.username || userInfo?.name || "",
        customerEmail: userInfo?.email || "",
        customerPhone: userInfo?.phone || "",
        shippingAddress: userInfo?.address || "",
      };
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_EnEoGL7F9kpNGQ", // Replace with your Razorpay key_id
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "Orebi Shop",
        description: "Order Payment",
        handler: async function (response) {
          // response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
          const orderPayload = {
            data: {
              customerName: userInfo?.username || userInfo?.name || "",
              customerEmail: userInfo?.email || "",
              customerPhone: userInfo?.phone || "",
              shippingAddress: userInfo?.address || "",
              total: amount,
              order_status: "pending",
              orderItems: products,
              payment_id: response.razorpay_payment_id,
              payment_status: "paid",
              payment_method: "card",
              transaction_date: new Date().toISOString(),
              payment_amount: amount
            }
          };
          try {
            const orderRes = await fetch("http://localhost:1337/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderPayload)
            });
            const orderData = await orderRes.json();
            dispatch(resetCart());
            navigate("/payment/success", { state: { order: orderData.data } });
          } catch (err) {
            setErrorMsg("Order saving failed. Please contact support.");
          }
        },
        prefill: {
          name: userInfo?.username || userInfo?.name || "",
          email: userInfo?.email || "",
          contact: userInfo?.phone || "",
        },
        theme: { color: "#3399cc" },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setErrorMsg("Order failed. Please try again.");
    }
  };

  return (
    <div className="max-w-container mx-auto px-4 py-10">
      <Breadcrumbs title="Payment gateway" />
      <h1 className="text-2xl font-bold mb-4">Payment & Checkout</h1>
      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}
      <button
        onClick={handleRazorpayPayment}
        className="bg-primeColor text-white px-6 py-2 rounded hover:bg-black duration-300"
      >
        Pay with Razorpay
      </button>
      <Link to="/">
        <button className="w-52 h-10 bg-primeColor text-white text-lg mt-4 hover:bg-black duration-300">
          Explore More
        </button>
      </Link>
    </div>
  );
};

export default Payment;
