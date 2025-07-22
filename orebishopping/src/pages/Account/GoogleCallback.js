import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/orebiSlice';
import { strapiApi } from '../../api/strapi';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get access_token from URL params
        const params = new URLSearchParams(location.search);
        const response = await strapiApi.loginWithGoogle(params);

        if (response.data.jwt) {
          localStorage.setItem('token', response.data.jwt);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          dispatch(addUser(response.data));
          navigate('/');
        } else {
          console.error('No JWT token received');
          navigate('/signin');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        navigate('/signin');
      }
    };

    handleCallback();
  }, [dispatch, location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing Google Login...</h2>
        <p>Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 