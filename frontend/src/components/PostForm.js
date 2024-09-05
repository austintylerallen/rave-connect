import React from 'react';
import { FaPaperPlane, FaImage, FaCalendarAlt } from 'react-icons/fa'; // Import the icons

const PostForm = ({
  content,
  setContent,
  image,
  setImage,
  selectedEvent,
  handleSubmit,
  editingPostId,
  handleCancelEdit,
  handleOpenModal,
}) => {
  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="mb-8">
      <div className="flex">
        <textarea
          className="flex-1 p-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        {selectedEvent && (
          <div className="ml-4 flex flex-col items-center">
            {selectedEvent.image && (
              <img
                src={selectedEvent.image}
                alt={selectedEvent.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <p className="mt-2 text-sm text-gray-700 text-center">{selectedEvent.name}</p>
          </div>
        )}
      </div>

      {/* Buttons in one line */}
      <div className="flex items-center mt-4">
        {/* Custom file input button with image icon */}
        <label
          htmlFor="image-upload"
          className="cursor-pointer bg-darkPurple text-white rounded-full px-4 py-2 hover:bg-purple-600 transition-colors flex items-center"
        >
          <FaImage className="mr-2" /> {/* Only icon for image */}
        </label>
        <input
          type="file"
          id="image-upload"
          onChange={handleImageUpload}
          className="hidden"
        />
        {image && (
          <p className="ml-4 text-gray-500">
            Selected image: {image.name}
          </p>
        )}

        {/* Event button with calendar icon only */}
        <button
          type="button"
          className="ml-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
          onClick={handleOpenModal}
        >
          <FaCalendarAlt /> {/* Only icon for event */}
        </button>

        {/* Send button with icon only */}
        <button
          type="submit"
          className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaPaperPlane />
        </button>
      </div>
    </form>
  );
};

export default PostForm;
