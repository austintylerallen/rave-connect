import { combineReducers } from 'redux';
import authReducer from './authReducer';
import profileReducer from './profileReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  // Add more reducers as needed
});

export default rootReducer;
