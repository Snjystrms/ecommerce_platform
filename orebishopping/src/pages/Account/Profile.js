import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { strapiApi } from "../../api/strapi";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.orebi);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    // Redirect to signin if not logged in
    if (!userInfo) {
      navigate("/signin");
    }
  }, [userInfo, navigate]);

  const handleViewOrders = async () => {
    setLoadingOrders(true);
    setOrdersError("");
    try {
      const res = await strapiApi.getOrders();
      setOrders(res.data.data || []);
      console.log("Fetched orders:", res.data.data);
    } catch (err) {
      setOrdersError("Failed to fetch orders.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="mb-4">You need to be logged in to view your profile.</p>
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
        <p><strong>Name:</strong> {userInfo.user?.username || "-"}</p>
        <p><strong>Email:</strong> {userInfo.user?.email || "-"}</p>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          className="bg-primeColor text-white px-6 py-2 rounded hover:bg-black duration-300"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
        <button
          className="bg-primeColor text-white px-6 py-2 rounded hover:bg-black duration-300"
          onClick={handleViewOrders}
          disabled={loadingOrders}
        >
          {loadingOrders ? "Loading Orders..." : "View My Orders"}
        </button>
      </div>
      {ordersError && <div className="text-red-500 mt-4">{ordersError}</div>}
      {orders.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">My Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              order?.id ? (
                <div key={order.id} className="border p-4 rounded text-left">
                  <div><strong>Order ID:</strong> {order.id}</div>
                  <div><strong>Date:</strong> {order.attributes?.transaction_date ? 
                    new Date(order.attributes.transaction_date).toLocaleString() : "-"}</div>
                  <div><strong>Status:</strong> {order.attributes?.payment_status || "-"}</div>
                  <div><strong>Total:</strong> ${order.attributes?.total || 0}</div>
                  <div className="mt-2">
                    <strong>Items:</strong>
                    {order.attributes?.orderItems && order.attributes.orderItems.length > 0 ? (
                      <ul className="ml-4 mt-2 space-y-2">
                        {order.attributes.orderItems.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <span>{item.name || "Product"}</span>
                            <span className="text-gray-600">x{item.quantity}</span>
                            <span className="text-gray-600">@ ${item.price}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="ml-4 mt-2 text-gray-500">No items found</p>
                    )}
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </div>
      )}
      {orders.length === 0 && !loadingOrders && 
        <div className="mt-6 text-gray-500">No orders found.</div>}
    </div>
  );
};

export default Profile; 