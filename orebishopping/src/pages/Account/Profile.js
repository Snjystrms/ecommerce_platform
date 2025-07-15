import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);
  console.log(userInfo);
  const navigate = useNavigate();

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
    </div>
  );
};

export default Profile; 