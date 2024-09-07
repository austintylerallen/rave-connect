import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  // If user is authenticated, render the child component
  return children;
};

export default ProtectedRoute;
