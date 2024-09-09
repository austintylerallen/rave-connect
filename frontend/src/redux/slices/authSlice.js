import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Use default import for jwt-decode

// Initialize Axios instance with correct base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5002', // Point to backend port
  withCredentials: true, // Ensure credentials are sent with requests
});

// Retrieve token and decode user information from localStorage
const token = localStorage.getItem('token');
let user = null;

if (token) {
  try {
    user = jwtDecode(token);
    console.log('Decoded token:', user);  // Log the decoded token to debug

    // Check for user ID inside the token structure
    if (!user?.user?.id) {
      throw new Error('User ID is missing from token');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

const initialState = {
  user: user ? user.user : null,  // Only store the `user` part
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const token = response.data.token;
      const decoded = jwtDecode(token);  // Decode the token to get user data

      console.log('Decoded token on login:', decoded);  // Log the decoded token for debugging

      // Check for user ID inside the decoded token's user object
      if (!decoded?.user?.id) {
        throw new Error('User ID is missing from decoded token');
      }

      // Store token and user information in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decoded.user));  // Store only the user object

      return { user: decoded.user, token }; // Return the user object and token
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for registration
export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', { username, email, password });
      const token = response.data.token;
      const decoded = jwtDecode(token);  // Decode the token to get user data

      console.log('Decoded token on register:', decoded);  // Log the decoded token for debugging

      // Check for user ID inside the decoded token's user object
      if (!decoded?.user?.id) {
        throw new Error('User ID is missing from decoded token');
      }

      // Store token and user information in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decoded.user));  // Store only the user object

      return { user: decoded.user, token };
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      const token = action.payload;
      const decoded = jwtDecode(token);
      console.log('Decoded token on setUser:', decoded);  // Log the decoded token for debugging

      // Check for user ID inside the decoded token's user object
      if (!decoded?.user?.id) {
        console.error('User ID is missing from decoded token');
        return;
      }
      state.token = token;
      state.user = decoded.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decoded.user));
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { setUser, clearUser, clearError } = authSlice.actions;

export default authSlice.reducer;
