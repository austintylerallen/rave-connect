import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import EventDetail from './components/EventDetail';
import ProfileView from './pages/ProfilePage'; // Assuming this is the correct component for profile view
import ProfileEdit from './components/ProfileEdit';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Login from './components/Login';
import Register from './components/Register';
import Timeline from './components/Timeline';
import Notifications from './components/Notifications';
import LandingPage from './components/LandingPage';
import ProfilePage from './pages/ProfilePage';

const currentUserId = localStorage.getItem('userId'); // Assuming user ID is stored here

function App() {
  return (
    <Router>
      <div className="App bg-darkTeal text-white min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Default to LandingPage */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
          
          {/* Updated redirect logic for profile */}
          <Route path="/profile" element={currentUserId ? <Navigate to={`/profile/${currentUserId}`} /> : <Navigate to="/login" />} /> {/* Redirect to current user profile or login */}
          
          <Route path="/profile/:id" element={<ProfilePage />} /> {/* Profile page for any user */}
          <Route path="/profile/:id/edit" element={<ProfileEdit />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/timeline" element={<Timeline />} /> {/* Timeline */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
