import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expecting order details to be passed via location.state
  const order = location.state?.order;

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-lg mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
      {order ? (
        <div className="mb-6 text-left">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <p><strong>Order ID:</strong> {order.id || order.orderId || order.order_id}</p>
          <p><strong>Name:</strong> {order.customerName}</p>
          <p><strong>Email:</strong> {order.customerEmail}</p>
          <p><strong>Phone:</strong> {order.customerPhone}</p>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          {order.orderItems && Array.isArray(order.orderItems) && (
            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc ml-6">
                {order.orderItems.map((item, idx) => (
                  <li key={idx}>{item.productName || item.title} x {item.quantity} @ ₹{item.price}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="mb-6">Order details not available.</p>
      )}
      <button
        className="bg-primeColor text-white px-6 py-2 rounded hover:bg-black duration-300"
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default Success; 