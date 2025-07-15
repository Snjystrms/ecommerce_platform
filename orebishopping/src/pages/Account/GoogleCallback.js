import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/orebiSlice";
import axios from "axios";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Parse access_token (Strapi JWT) from URL query params
    const params = new URLSearchParams(window.location.search);
    const jwt = params.get("access_token") || params.get("jwt");

    if (jwt) {
      localStorage.setItem("token", jwt);
      // Fetch user info from Strapi using the token
      axios
        .get("http://localhost:1337/api/users/me", {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        .then((res) => {
          dispatch(setUserInfo(res.data));
          setTimeout(() => {
            navigate("/profile");
          }, 1000);
        })
        .catch(() => {
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        });
    } else {
      // If not found, redirect to signin or show error
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [navigate, dispatch]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-lg font-semibold">Logging you in with Google...</div>
    </div>
  );
};

export default GoogleCallback; 