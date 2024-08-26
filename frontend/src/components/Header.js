import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user'); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/'); // Redirect to the landing page
  };

  return (
    <header className="bg-teal text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rave Connect</h1>
        <nav className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link to="/Timeline" className="hover:text-purple">Home</Link>
              <Link to="/events" className="hover:text-purple">Events</Link>
              <Link to="/profile" className="hover:text-purple">Profile</Link>
              <Link to="/notifications" className="hover:text-purple relative">
                <FaBell />
                {/* You can add a notification badge here */}
              </Link>
              <button 
                onClick={handleLogout} 
                className="hover:text-purple focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple">Login</Link>
              <Link to="/register" className="hover:text-purple">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
