import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Timeline'); // Redirect to Timeline after successful login
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear the input fields after login attempt
    setPassword('');
  }, [loading]);

  return (
    <div className="w-full max-w-md p-8 rounded-lg shadow-md mx-auto mt-20"> {/* Center the form on the page */}
      <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple text-black placeholder-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple text-black placeholder-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple hover:bg-darkPurple text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="mt-4 text-center text-red-500">Error: {error}</p>}
    </div>
  );
};

export default Login;
