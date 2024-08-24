import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

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

  // Conditionally get the event name
  const eventName = selectedEvent?.name || selectedEvent?.artists?.map(artist => artist.name).join(', ') || 'Unnamed Event';

  return (
    <form onSubmit={handleSubmit} className="mb-8">
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
            <img
              src={selectedEvent.image}
              alt={eventName}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <p className="mt-2 text-sm text-gray-700 text-center">
              {eventName}
            </p>
          </div>
        )}
      </div>
      <input type="file" onChange={handleImageUpload} className="mt-4" />
      <div className="flex mt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaPaperPlane className="mr-2" />
          {editingPostId ? 'Update Post' : 'Connect'}
        </button>
        {editingPostId && (
          <button
            type="button"
            className="ml-4 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          className="ml-auto px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          onClick={handleOpenModal}
        >
          Select Event
        </button>
      </div>
    </form>
  );
};

export default PostForm;
