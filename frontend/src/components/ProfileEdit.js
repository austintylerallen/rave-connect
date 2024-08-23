import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    favoriteGenres: [],
    profilePicture: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${id}`, profile);
      navigate(`/profile/${id}`);
    } catch (error) {
      setError('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-darkTeal rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Edit Profile</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white text-darkTeal"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white text-darkTeal"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">Favorite Genres</label>
          <input
            type="text"
            name="favoriteGenres"
            value={profile.favoriteGenres.join(', ')}
            onChange={(e) => setProfile({ ...profile, favoriteGenres: e.target.value.split(', ') })}
            className="w-full p-3 rounded bg-white text-darkTeal"
            placeholder="Comma separated values"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">Profile Picture URL</label>
          <input
            type="text"
            name="profilePicture"
            value={profile.profilePicture}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white text-darkTeal"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple text-white py-3 rounded font-semibold hover:bg-darkPurple transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
