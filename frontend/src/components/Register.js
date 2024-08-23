import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct named import

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      
      // Save the token and user ID in localStorage
      const token = response.data.token;
      const user = jwtDecode(token).user; // Use jwtDecode to extract the user info from the token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
  
      // Redirect to the user's profile
      navigate(`/profile/${user.id}`);
    } catch (error) {
      setError('Error registering. Please try again.');
      console.error('Error registering:', error);
    }


  };

  return (
    <div className="flex justify-center items-center h-screen bg-darkTeal">
      <div className="w-full max-w-md p-8 bg-teal shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2">Username</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-white text-darkTeal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-white text-darkTeal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-white text-darkTeal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple text-white py-3 rounded font-semibold hover:bg-darkPurple transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
