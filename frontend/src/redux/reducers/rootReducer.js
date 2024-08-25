// src/redux/rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // add other reducers here
});

export default rootReducer;
