import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from './PostForm';
import PostList from './PostList';
import ErrorAlert from '../UI/ErrorAlert';
import LoadingSpinner from '../UI/LoadingSpinner';
import EventSelectionModal from './EventSelectionModal';

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

    let postData;
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Check if an image or video is present
    if (image) {
      postData = new FormData();
      postData.append('text', content.trim());
      postData.append('image', image);
      if (selectedEvent) {
        postData.append('event', selectedEvent.id);
        postData.append('eventImage', selectedEvent.image);
        postData.append('eventName', selectedEvent.name);
      }
    } else {
      postData = {
        text: content.trim(),
        event: selectedEvent?.id || null,
        eventImage: selectedEvent?.image || null,
        eventName: selectedEvent?.name || null,
      };
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      let response;
      if (editingPostId) {
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/posts/${editingPostId}`,
          postData,
          config
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/posts`,
          postData,
          config
        );
      }
      setPosts([response.data, ...posts]);
      setEditingPostId(null);
      setContent('');
      setImage(null);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error submitting post:', err.response?.data || err.message);
      setError('Failed to submit post. Please try again.');
    }
};

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setContent(post.text);
    setImage(null);
    setSelectedEvent(post.event ? { id: post.event._id, name: post.event.name, image: post.event.imageUrl } : null);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setContent('');
    setImage(null);
    setSelectedEvent(null);
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

  const handleLike = async (postId) => {
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`, {}, config);
      setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
    } catch (err) {
      console.error('Error liking post:', err);
      setError('Failed to like post. Please try again.');
    }
  };

  const handleReply = async (postId, replyContent) => {
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comment`, { text: replyContent }, config);
      setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
    } catch (err) {
      console.error('Error replying to post:', err);
      setError('Failed to reply to post. Please try again.');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Timeline</h2>

      <ErrorAlert error={error} />

      <PostForm
        content={content}
        setContent={setContent}
        image={image}
        setImage={setImage}
        selectedEvent={selectedEvent}
        handleSubmit={handleSubmit}
        editingPostId={editingPostId}
        handleCancelEdit={handleCancelEdit}
        handleOpenModal={handleOpenModal} // Passing the function to PostForm
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <PostList
          posts={posts}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleLike={handleLike}
          handleReply={handleReply}
        />
      )}

      <EventSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectEvent={handleEventSelect}
      />
    </div>
  );
};

export default Timeline;
