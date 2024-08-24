// ErrorAlert.js
import React from 'react';

const ErrorAlert = ({ error }) => {
  return (
    error && (
      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    )
  );
};

export default ErrorAlert;
