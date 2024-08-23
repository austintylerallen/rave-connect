import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import EventDetail from './components/EventDetail';
import ProfileView from './components/ProfileView';
import ProfileEdit from './components/ProfileEdit';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Login from './components/Login';
import Register from './components/Register';
import Timeline from './components/Timeline'; // Import the Timeline component

function App() {
  return (
    <Router>
      <div className="App bg-darkTeal text-white min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Timeline />} /> {/* Set Timeline as the homepage */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/profile/:id" element={<ProfileView />} />
          <Route path="/profile/:id/edit" element={<ProfileEdit />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/events" element={<EventList />} /> {/* Ensure events route is added */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
