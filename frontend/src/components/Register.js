import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', { username, email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/'); // Redirect to homepage or dashboard after registration
    } catch (error) {
      setError('Error registering user');
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-darkTeal rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-teal">Username</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-white text-darkTeal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <div className="mb-4">
          <label className="block text-teal">Password</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-white text-darkTeal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-purple text-white py-2 px-4 rounded hover:bg-darkPurple">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
