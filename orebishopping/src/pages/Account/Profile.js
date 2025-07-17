import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  console.log(userInfo);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const handleViewOrders = async () => {
    setLoadingOrders(true);
    setOrdersError("");
    try {
      const res = await axios.get("http://localhost:1337/api/orders");
      setOrders(res.data.data || []);
      console.log("Fetched orders:", res.data.data);
    } catch (err) {
      setOrdersError("Failed to fetch orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
        <button
          className="bg-primeColor text-white px-6 py-2 rounded hover:bg-black duration-300"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
      <h1 className="text-3xl font-bold text-primeColor mb-4">Profile</h1>
      <div className="mb-6 text-left">
        <p><strong>Name:</strong> {userInfo.username || userInfo.name || "-"}</p>
        <p><strong>Email:</strong> {userInfo.email || "-"}</p>
        {userInfo.phone && <p><strong>Phone:</strong> {userInfo.phone}</p>}
        {userInfo.address && <p><strong>Address:</strong> {userInfo.address}</p>}
      </div>
      <button
        className="bg-primeColor text-white px-6 py-2 rounded hover:bg-black duration-300"
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>
      <button
        className="bg-primeColor text-white px-4 py-2 rounded hover:bg-black duration-300 mt-4"
        onClick={handleViewOrders}
        disabled={loadingOrders}
      >
        {loadingOrders ? "Loading Orders..." : "View My Orders"}
      </button>
      {ordersError && <div className="text-red-500 mt-2">{ordersError}</div>}
      {orders.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">My Orders</h2>
          <ul className="space-y-4">
            {orders.map((order) => (
              order && order.id ? (
                <li key={order.id} className="border p-4 rounded">
                  <div><strong>Order ID:</strong> {order.id}</div>
                  <div><strong>Order Date:</strong> {order.transaction_date ? new Date(order.transaction_date).toLocaleString() : "-"}</div>
                  <div><strong>Shipping Address:</strong> {order.shippingAddress || '-'}</div>
                  <div><strong>Payment Status:</strong> {order.payment_status || '-'}</div>
                  <div><strong>Total:</strong> ₹{order.total}</div>
                  <div className="mt-2">
                    <strong>Products:</strong>
                    {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                      <ul className="ml-4 mt-1 space-y-2">
                        {order.orderItems.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            {item.image ? (
                              <img src={item.image} alt={item.productName || item.title || 'Product'} className="w-12 h-12 object-cover rounded" />
                            ) : (
                              <span className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded text-xs text-gray-500">No Image</span>
                            )}
                            <span>{item.productName || item.title || 'Unnamed Product'}</span>
                            <span className="ml-2 text-gray-600">x {item.quantity}</span>
                            <span className="ml-2 text-gray-600">@ ₹{item.price}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="ml-4 text-gray-500">No products found.</div>
                    )}
                  </div>
                </li>
              ) : (
                <li key={order.id || Math.random()} className="border p-3 rounded text-red-500">Invalid order data</li>
              )
            ))}
          </ul>
        </div>
      )}
      {orders.length === 0 && !loadingOrders && <div className="mt-6 text-gray-500">No orders found.</div>}
    </div>
  );
};

export default Profile; 