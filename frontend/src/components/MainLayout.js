import React from 'react';
import Sidebar from './Sidebar'; // Your updated sidebar

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="relative w-full ml-64 p-6">
        {/* Semi-transparent dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        {/* Main content */}
        <div className="relative z-10 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
