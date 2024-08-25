import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user'); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-teal text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rave Connect</h1>
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/" className="hover:text-purple mx-4">Home</Link>
              <Link to="/events" className="hover:text-purple mx-4">Events</Link>
              <Link to="/profile" className="hover:text-purple mx-4">Profile</Link>
              <Link to="/notifications" className="hover:text-purple mx-4 relative">
                <FaBell />
                {/* You can add a notification badge here */}
              </Link>
              <button onClick={handleLogout} className="hover:text-purple mx-4">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple mx-4">Login</Link>
              <Link to="/register" className="hover:text-purple mx-4">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
