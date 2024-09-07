import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/slices/authSlice'; // Make sure this is correctly imported

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const { isAuthenticated } = useSelector((state) => state.auth); // Get authentication status from Redux state

  const handleLogout = () => {
    // Clear token and user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Dispatch action to clear user from Redux state
    dispatch(clearUser());

    // Redirect to login page after logging out
    navigate('/login');
  };

  return (
    <header className="bg-teal text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rave Connect</h1>
        <nav className="flex items-center space-x-6">
          {isAuthenticated ? ( // Check authentication from Redux state
            <>
              <Link to="/timeline" className="hover:text-purple">Home</Link>
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
