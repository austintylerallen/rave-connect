import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to perform this action.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (editingPostId) {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/posts/${editingPostId}`,
          { text: content },
          config
        );
        setPosts(posts.map((post) => (post._id === editingPostId ? response.data : post)));
        setEditingPostId(null);
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/posts`,
          { text: content },
          config
        );
        setPosts([response.data, ...posts]);
      }
      setContent('');
    } catch (err) {
      console.error('Error submitting post:', err);
      setError('Failed to submit post. Please try again.');
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setContent(post.text);
  };

  const handleDelete = async (postId) => {
    setError(null);
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to perform this action.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, config);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Timeline</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          className="w-full p-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {editingPostId ? 'Update Post' : 'Create Post'}
        </button>
        {editingPostId && (
          <button
            type="button"
            className="mt-4 ml-4 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={() => {
              setEditingPostId(null);
              setContent('');
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500">Loading posts...</div>
      ) : (
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="mb-6 p-6 bg-white rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img
                      src={post.user?.profilePicture || '/default-avatar.png'}
                      alt="User avatar"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {post.user?.username || 'Anonymous'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {post.date && formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(post)}
                      className="mr-3 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{post.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No posts available.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline;