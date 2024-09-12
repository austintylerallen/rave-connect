import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import EventDetail from './components/EventDetail';
import ProfilePage from './pages/ProfilePage';
import ProfileEdit from './components/ProfileEdit';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Login from './components/Login';
import Register from './components/Register';
import Timeline from './components/Timeline';
import Notifications from './components/Notifications';
import LandingPage from './components/LandingPage';

const currentUserId = localStorage.getItem('userId'); // Assuming user ID is stored here

function App() {
  return (
    <Router>
      <div
        className="App relative"
        style={{
          backgroundImage: "url('/background.svg')", // Path to the SVG file in the public folder
          backgroundSize: 'cover', // Ensure the background covers the screen
          backgroundPosition: 'center', // Center the background
          backgroundRepeat: 'no-repeat', // Prevent background from repeating
          minHeight: '100vh', // Ensure it covers the full viewport height
          zIndex: -1, // Set the background behind other elements
          position: 'fixed', // Make sure the background covers the entire screen
          width: '100%', // Ensure the background covers full width
          height: '100%', // Ensure the background covers full height
        }}
      >
        {/* Background div is positioned with z-index to be behind content */}
      </div>

      <div className="min-h-screen flex relative z-10 text-white">
        <Sidebar /> {/* Sidebar will be fixed to the left */}
        <div className="flex-grow ml-72 relative">
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
          
          {/* Main content */}
          <div className="relative z-10 p-6"> {/* Added padding to the main content */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/profile" element={currentUserId ? <Navigate to={`/profile/${currentUserId}`} /> : <Navigate to="/login" />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/profile/:id/edit" element={<ProfileEdit />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/timeline" element={<Timeline />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
