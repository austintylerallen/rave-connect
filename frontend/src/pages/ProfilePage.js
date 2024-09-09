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
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null); // New state for cover photo
  const [interests, setInterests] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false); // Added for image upload status
  const [activeTab, setActiveTab] = useState('Posts'); // State for tabs

  useEffect(() => {
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
        setCoverPhoto(res.data.coverPhoto || ''); // Set cover photo from DB
        setProfilePicture(res.data.profilePicture || ''); // Set profile picture from DB
        setInterests(res.data.interests?.join(', ') || ''); // Assuming interests is an array
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
      // Save the bio, profilePicture, and coverPhoto in the backend
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${id}`,
        {
          bio,
          profilePicture, // Save profile picture URL to the database
          coverPhoto, // Save cover photo URL to the database
          interests: interests.split(',').map((interest) => interest.trim()), // Convert to array
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Error updating profile');
    }
  };

  // Upload Profile Picture
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
      setUploadingImage(false); // Set uploading status to false
    } catch (err) {
      console.error('Error uploading image', err);
      setError('Error uploading image');
      setUploadingImage(false); // Ensure we clear the uploading state
    }
  };

  // Upload Cover Photo
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
      setUploadingImage(false); // Set uploading status to false
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
      <div className="cover-photo relative">
        <img
          src={coverPhoto || 'default-cover-photo.jpg'}
          className="w-full h-60 object-cover"
          alt="Cover"
        />
        {id === currentUserId && (
          <div className="absolute bottom-2 right-2">
            {/* Custom styled button for cover photo upload */}
            <label className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg cursor-pointer inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              Choose Cover Photo
              <input type="file" onChange={handleCoverPhotoUpload} className="hidden" />
            </label>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="profile mt-6">
        <div className="profile-picture-container relative">
          {uploadingImage ? (
            <p>Uploading image...</p> // Show feedback while uploading the profile picture
          ) : profilePicture ? (
            <img src={profilePicture} alt={user.username} className="w-32 h-32 rounded-full mb-4 border-4 border-white" />
          ) : user.profilePicture ? (
            <img src={user.profilePicture} alt={user.username} className="w-32 h-32 rounded-full mb-4 border-4 border-white" />
          ) : (
            <p>No profile picture</p>
          )}
          {id === currentUserId && (
            <label className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg cursor-pointer inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              Choose Profile Photo
              <input type="file" onChange={handleProfilePictureUpload} className="hidden" />
            </label>
          )}
        </div>

        <h1 className="text-4xl mb-2">{user.username}</h1>

        {isEditing ? (
          <>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4 text-black bg-gray-100"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Edit your bio"
            />
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4 text-black bg-gray-100"
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
            <p className="text-lg">{bio || 'No bio available'}</p>
            <p className="text-lg">Interests: {user.interests?.join(', ') || 'No interests provided'}</p>
            {id === currentUserId && (
              <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">
                Edit Profile
              </button>
            )}
          </>
        )}

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
    </div>
  );
};

export default ProfilePage;
