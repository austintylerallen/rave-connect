import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(response.data.msg);
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error resetting password');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-darkTeal rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-teal">New Password</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-white text-darkTeal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-purple text-white py-2 px-4 rounded hover:bg-darkPurple">
          Reset Password
        </button>
      </form>
      {message && <p className="text-white mt-4">{message}</p>}
    </div>
  );
};

export default ResetPassword;
