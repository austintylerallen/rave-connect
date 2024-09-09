import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice'; // Assuming you are dispatching a register action
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(register({ username, email, password }));
  };

  // Effect to handle redirect after successful registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile'); // Redirect to profile or any page after successful registration
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-darkTeal">
      <div className="w-full max-w-md bg-teal p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple hover:bg-darkPurple text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">Error: {error}</p>}
      </div>
    </div>
  );
};

export default Register;
