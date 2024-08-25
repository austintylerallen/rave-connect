import { FETCH_NOTIFICATIONS, MARK_NOTIFICATION_AS_READ } from '../actions/types';

const initialState = {
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case MARK_NOTIFICATION_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === action.payload._id ? action.payload : notification
        ),
      };
    default:
      return state;
  }
}
