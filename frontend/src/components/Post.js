import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaEdit, FaTrash, FaHeart, FaReply, FaTag } from 'react-icons/fa';

const Post = ({ post, handleEdit, handleDelete, handleLike, handleReply }) => {
  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <img
            src={post.user?.profilePicture || '/default-avatar.png'}
            alt="User avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-gray-900 font-semibold">
              {post.user?.username || 'Anonymous'}
            </p>
            <p className="text-gray-700 text-sm">
              {post.date && formatDistanceToNow(new Date(post.date), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => handleEdit(post)}
            className="mr-3 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors flex items-center"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(post._id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>
      <p className="text-gray-900">{post.text}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post" className="w-full mt-4 rounded-lg" />
      )}
      {post.videoUrl && (
        <video controls className="w-full mt-4 rounded-lg">
          <source src={post.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {post.eventImage && (
        <div className="mt-4 flex items-center">
          <img src={post.eventImage} alt="Event" className="w-20 h-20 object-cover rounded-lg mr-3" />
          <span className="text-lg font-semibold text-gray-900">{post.event?.name || 'Unnamed Event'}</span>
        </div>
      )}
      <div className="mt-4 flex items-center">
        <button
          onClick={() => handleLike(post._id)}
          className="mr-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaHeart className="mr-2" />
          Like ({post.likes.length})
        </button>
        <button
          onClick={() => handleReply(post._id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
        >
          <FaReply className="mr-2" />
          Reply
        </button>
      </div>
    </div>
  );
};

export default Post;
