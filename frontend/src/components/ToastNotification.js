import React from 'react';
import './ToastNotification.css'; // Make sure to import the CSS for styling

const ToastNotification = ({ message, type }) => {
  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
};

export default ToastNotification;
