import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/slices/authSlice'; // Make sure this is correctly imported

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const { isAuthenticated } = useSelector((state) => state.auth); // Get authentication status from Redux state

  const handleLogout = () => {
    // Clear all data from localStorage
    window.localStorage.clear();

    // Dispatch action to clear user from Redux state
    dispatch(clearUser());

    // Redirect to login page after logging out
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-full flex flex-col items-center p-4 space-y-6 sidebar"> {/* Applied the custom sidebar class */}
      <div className="flex flex-col space-y-8">
        <h1 className="text-2xl font-bold mb-4 uppercase">Rave Connect</h1> {/* Added uppercase */}
        
        {isAuthenticated ? ( // Check authentication from Redux state
          <>
            <Link 
              to="/timeline" 
              className="sidebar-item uppercase transition duration-300 transform hover:scale-110 hover:text-purple-500"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="sidebar-item uppercase transition duration-300 transform hover:scale-110 hover:text-purple-500"
            >
              Events
            </Link>
            <Link 
              to={`/profile/${localStorage.getItem('userId')}`}  // Updated to dynamically use the current user's ID
              className="sidebar-item uppercase transition duration-300 transform hover:scale-110 hover:text-purple-500"
            >
              Profile
            </Link>
            <Link 
              to="/notifications" 
              className="sidebar-item uppercase transition duration-300 transform hover:scale-110 hover:text-purple-500 relative"
            >
              <FaBell size={20} />
              {/* You can add a notification badge here */}
            </Link>
            <button
              onClick={handleLogout}
              className="sidebar-item uppercase hover:text-purple-500 focus:outline-none transition duration-300 transform hover:scale-110 text-left"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="sidebar-item uppercase transition duration-300 transform hover:scale-110 hover:text-purple-500"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="sidebar-item uppercase transition duration-300 transform hover:scale-110 hover:text-purple-500"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
