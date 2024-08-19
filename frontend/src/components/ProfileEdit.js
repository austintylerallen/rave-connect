import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileEdit = ({ userId }) => {
  const [bio, setBio] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`).then((response) => {
      setBio(response.data.bio);
      setFavoriteGenres(response.data.favoriteGenres);
      setProfilePicture(response.data.profilePicture);
    });
  }, [userId]);

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('favoriteGenres', favoriteGenres);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.put(`/api/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Profile updated:', response.data);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-darkTeal rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-teal">Bio</label>
          <textarea
            className="w-full p-2 rounded bg-white text-darkTeal"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-teal">Favorite Genres</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-white text-darkTeal"
            value={favoriteGenres.join(', ')}
            onChange={(e) => setFavoriteGenres(e.target.value.split(',').map(genre => genre.trim()))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-teal">Profile Picture</label>
          <input
            type="file"
            className="w-full p-2 rounded bg-white text-darkTeal"
            onChange={handleProfilePictureChange}
          />
        </div>
        <button type="submit" className="bg-purple text-white py-2 px-4 rounded hover:bg-darkPurple">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
