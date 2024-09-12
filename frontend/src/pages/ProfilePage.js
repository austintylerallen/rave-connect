import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { id } = useParams(); // Get the user ID from the URL params
  const currentUserId = localStorage.getItem('userId'); // Fetch the current logged-in user ID
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(''); // Initialize as an empty string
  const [coverPhoto, setCoverPhoto] = useState(''); // Initialize as an empty string
  const [interests, setInterests] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false); // Added for image upload status
  const [activeTab, setActiveTab] = useState('Posts'); // State for tabs

  useEffect(() => {
    console.log('Current User ID from localStorage:', localStorage.getItem('userId')); // Log userId from localStorage
  
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!id) {
        setError('Invalid user ID');
        setLoading(false);
        return;
      }
  
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setBio(res.data.bio || '');
        setCoverPhoto(res.data.coverPhoto || '');
        setProfilePicture(res.data.profilePicture || '');
        setInterests(res.data.interests?.join(', ') || '');
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('User not found or unauthorized');
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [id]);
  

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const updatedUser = {
        bio,
        profilePicture, 
        coverPhoto,
        interests: interests.split(',').map((interest) => interest.trim()), // Ensure interests are sent as an array
      };
  
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data); // Update local state with the updated user data
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError('Error updating profile');
    }
  };

  // Automatically save after uploading profile or cover photo
  const autoSavePhotos = async (updatedData) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));
      setUploadingImage(false);
    } catch (err) {
      console.error("Error saving photos:", err);
      setError('Error saving photos');
      setUploadingImage(false);
    }
  };

  // Upload Profile Picture and auto-save it
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    setUploadingImage(true); // Set uploading state

    try {
      const signatureResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/cloudinary/get-signature`);
      const { signature, timestamp } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', '589989464939994'); // Cloudinary API Key
      formData.append('timestamp', timestamp);
      formData.append('signature', signature); // Use the signed signature from backend

      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dnoc047l5/image/upload',
        formData
      );
      setProfilePicture(res.data.secure_url); // Save the uploaded image URL
      autoSavePhotos({ profilePicture: res.data.secure_url }); // Auto-save after upload
    } catch (err) {
      console.error('Error uploading profile picture', err);
      setError('Error uploading profile picture');
      setUploadingImage(false); // Ensure we clear the uploading state
    }
  };

  // Upload Cover Photo and auto-save it
  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0];
    setUploadingImage(true); // Set uploading state

    try {
      const signatureResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/cloudinary/get-signature`);
      const { signature, timestamp } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', '589989464939994'); // Cloudinary API Key
      formData.append('timestamp', timestamp);
      formData.append('signature', signature); // Use the signed signature from backend

      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dnoc047l5/image/upload',
        formData
      );
      setCoverPhoto(res.data.secure_url); // Save the uploaded cover photo URL
      autoSavePhotos({ coverPhoto: res.data.secure_url }); // Auto-save after upload
    } catch (err) {
      console.error('Error uploading cover photo', err);
      setError('Error uploading cover photo');
      setUploadingImage(false); // Ensure we clear the uploading state
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto py-8">
    {/* Cover Photo */}
    <div className="relative group w-full h-64 bg-gray-200">
      {/* The cover photo itself */}
      <img
        src={coverPhoto || '/placeholder-cover-photo.jpg'}
        alt="Cover"
        className="object-cover w-full h-full transition-all duration-500 ease-in-out group-hover:blur-sm"
      />
  
      {/* Hover overlay with text */}
      <label className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-500 ease-in-out flex items-center justify-center cursor-pointer">
        <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
          Edit Cover Photo
        </span>
        <input
          type="file"
          onChange={handleCoverPhotoUpload}
          className="hidden" // Hidden input for the file upload
        />
      </label>
    </div>
  
    {/* Profile Info Section */}
    <div className="profile mt-6 flex flex-col items-center">
      {/* Profile Picture */}
      {/* Profile Picture */}
<div className="relative">
  {uploadingImage ? (
    <p>Uploading image...</p>
  ) : profilePicture ? (
    <img
      src={profilePicture}
      alt={user.username}
      className="w-32 h-32 rounded-full border-4 border-white object-cover"
    />
  ) : (
    <img
      src="/profile-photo-placeholder.jpg" // Path to the placeholder image
      alt="Profile Placeholder"
      className="w-32 h-32 rounded-full border-4 border-white object-cover"
    />
  )}

  {/* Hidden input for profile picture upload */}
  {id === currentUserId && (
    <label className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8h16M4 16h16"
        />
      </svg>
      <input
        type="file"
        onChange={handleProfilePictureUpload}
        className="hidden"
      />
    </label>
  )}
</div>

  
      {/* User Details */}
      <h1 className="text-3xl font-semibold mt-4">{user.username}</h1>
  
      {/* Bio and Interests */}
      {isEditing ? (
        <>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Edit your bio"
          />
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Edit your interests (comma separated)"
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </>
      ) : (
        <>
          <p className="text-lg mt-4">{bio || 'No bio available'}</p>
          <p className="text-lg mt-2">Interests: {interests || 'No interests provided'}</p>
          {id === currentUserId && (
            <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
              Edit Profile
            </button>
          )}
        </>
      )}
    </div>
  
    {/* Tabbed Section */}
    <div className="mt-6">
      <ul className="flex space-x-4 border-b">
        <li
          className={`cursor-pointer ${activeTab === 'Posts' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('Posts')}
        >
          Posts
        </li>
        <li
          className={`cursor-pointer ${activeTab === 'Friends' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('Friends')}
        >
          Friends
        </li>
        <li
          className={`cursor-pointer ${activeTab === 'Photos' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('Photos')}
        >
          Photos
        </li>
        <li
          className={`cursor-pointer ${activeTab === 'Activity' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('Activity')}
        >
          Activity
        </li>
      </ul>
  
      {/* Tab Content */}
      <div className="tab-content mt-4">
        {activeTab === 'Posts' && <div>Posts will be displayed here...</div>}
        {activeTab === 'Friends' && <div>Friends list will be displayed here...</div>}
        {activeTab === 'Photos' && <div>Photo gallery will be displayed here...</div>}
        {activeTab === 'Activity' && <div>Recent activity will be displayed here...</div>}
      </div>
    </div>
  </div>
  
  );
};

export default ProfilePage;
