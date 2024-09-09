import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5002', // Use the correct backend port
  withCredentials: true, // Ensure this is true if you are sending cookies or credentials
});

export default api;
