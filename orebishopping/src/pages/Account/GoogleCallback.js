import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/orebiSlice";
import axios from "axios";

const isLikelyJWT = (token) => {
  return typeof token === "string" && token.split(".").length === 3;
};

const extractAccessTokenFromHash = (hash) => {
  const params = new URLSearchParams(hash.startsWith("#") ? hash.substring(1) : hash);
  return params.get("access_token");
};

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("[GoogleCallback] window.location.href:", window.location.href);
    // Extract from hash
    const hash = window.location.hash.substring(1);
    const hashToken = extractAccessTokenFromHash(hash);
    console.log("[GoogleCallback] Hash access_token:", hashToken);
    // Extract from query string
    const searchParams = new URLSearchParams(window.location.search);
    const queryToken = searchParams.get("access_token");
    console.log("[GoogleCallback] Query access_token:", queryToken);

    // Prefer queryToken, but fallback to hashToken if present
    const googleToken = queryToken || hashToken;
    console.log("[GoogleCallback] Google token to exchange:", googleToken);

    // If we have a Google token and it's NOT a JWT, exchange it for a Strapi JWT
    if (googleToken && !isLikelyJWT(googleToken)) {
      console.log("[GoogleCallback] Exchanging Google access_token for Strapi JWT...");
      axios
        .get(`http://localhost:1337/api/auth/google/callback?access_token=${googleToken}`)
        .then((res) => {
          console.log("[GoogleCallback] Strapi callback response:", res.data);
          if (res.data && res.data.jwt && res.data.user && isLikelyJWT(res.data.jwt)) {
            localStorage.setItem("token", res.data.jwt);
            dispatch(setUserInfo(res.data.user));
            setTimeout(() => {
              navigate("/profile");
            }, 1000);
          } else {
            console.warn("[GoogleCallback] No valid JWT/user in Strapi callback response:", res.data);
            setTimeout(() => {
              navigate("/signin");
            }, 2000);
          }
        })
        .catch((err) => {
          console.error("[GoogleCallback] Strapi callback error:", err);
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        });
      return;
    }

    // If we have a JWT (from hash or query), use it directly
    if (googleToken && isLikelyJWT(googleToken)) {
      console.log("[GoogleCallback] Using JWT for /users/me:", googleToken);
      localStorage.setItem("token", googleToken);
      axios
        .get("http://localhost:1337/api/users/me", {
          headers: { Authorization: `Bearer ${googleToken}` },
        })
        .then((res) => {
          console.log("[GoogleCallback] /users/me response:", res.data);
          dispatch(setUserInfo(res.data));
          setTimeout(() => {
            navigate("/profile");
          }, 1000);
        })
        .catch((err) => {
          console.error("[GoogleCallback] /users/me error:", err);
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        });
      return;
    }

    // If all else fails
    console.warn("[GoogleCallback] No usable token found, redirecting to signin.");
    setTimeout(() => {
      navigate("/signin");
    }, 2000);
  }, [navigate, dispatch]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-lg font-semibold">Logging you in with Google...</div>
    </div>
  );
};

export default GoogleCallback; 