// redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Async actions using createAsyncThunk
export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
    return res.data.token;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk('auth/register', async ({ username, email, password }, thunkAPI) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { username, email, password });
    return res.data.token;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Slice setup
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: null,
    loading: true,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const token = action.payload;
        const user = jwtDecode(token);
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        const token = action.payload;
        const user = jwtDecode(token);
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
