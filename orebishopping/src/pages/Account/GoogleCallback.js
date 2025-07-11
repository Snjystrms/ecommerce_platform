import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse id_token and access_token from URL query params
    const params = new URLSearchParams(window.location.search);
    const idToken = params.get("id_token");
    const accessToken = params.get("access_token");

    if (idToken && accessToken) {
      localStorage.setItem("id_token", idToken);
      localStorage.setItem("access_token", accessToken);
      // Optionally, fetch user info here using accessToken
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      // If not found, redirect to signin or show error
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-lg font-semibold">Logging you in with Google...</div>
    </div>
  );
};

export default GoogleCallback; 