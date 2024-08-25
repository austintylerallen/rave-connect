// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('token');
const user = token ? jwtDecode(token) : null;

const initialState = {
  user: user ? user : null,
  token: token || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      const token = action.payload;
      const user = jwtDecode(token);
      state.token = token;
      state.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
