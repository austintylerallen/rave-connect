import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation when the modal is opened
    setIsVisible(true);

    // Cleanup function to reset visibility on close
    return () => setIsVisible(false);
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay with a slight transition */}
      <div
        className={`fixed inset-0 transition-opacity duration-500 ${
          isVisible ? 'bg-gray-900 opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Modal content with slide/fade effect */}
      <div
        className={`bg-darkTeal text-white rounded-lg shadow-lg p-6 z-10 relative max-w-md w-full mx-auto transform transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ backgroundColor: '#1A546D' }} // Change modal background color
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-white hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
