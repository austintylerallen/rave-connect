import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { setUser, clearUser } from '../redux/slices/authSlice'; // Import your Redux actions

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // If the user is not authenticated but we have a token in localStorage, verify the token
    const verifyToken = async () => {
      const tokenInLocalStorage = localStorage.getItem('token');
      
      if (!isAuthenticated && tokenInLocalStorage) {
        try {
          // Send a request to verify the token and get the user data
          const response = await axios.get('/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${tokenInLocalStorage}`,
            },
          });

          // If successful, set the user in Redux store
          dispatch(setUser(tokenInLocalStorage));  // Dispatch action to set user in Redux
        } catch (err) {
          console.error('Token verification failed:', err);
          dispatch(clearUser());  // Dispatch action to clear user if token is invalid
        }
      }
    };

    verifyToken();
  }, [dispatch, isAuthenticated]);

  // If the user is still not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the child component
  return children;
};

export default ProtectedRoute;
