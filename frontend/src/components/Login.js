import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/'); // Redirect to homepage or dashboard after login
    } catch (error) {
      setError('Invalid credentials');
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-darkTeal">
      <div className="w-full max-w-md p-8 bg-teal shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-white hover:text-lightPurple hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="mt-4 text-center text-white">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple hover:text-lightPurple hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
