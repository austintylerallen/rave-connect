import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.msg);
    } catch (error) {
      console.error('Error sending password reset request:', error);
      setMessage('Error sending password reset request');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-darkTeal rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-teal">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-white text-darkTeal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-purple text-white py-2 px-4 rounded hover:bg-darkPurple">
          Send Reset Link
        </button>
      </form>
      {message && <p className="text-white mt-4">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
