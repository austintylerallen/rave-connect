import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-darkTeal text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Rave Connect</h1>
        <p className="mb-8">Please log in or register to continue</p>
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="bg-purple hover:bg-darkPurple text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-purple hover:bg-darkPurple text-white font-bold py-2 px-4 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
