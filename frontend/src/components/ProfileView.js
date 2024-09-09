import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';

const ProfileView = () => {
  const { id } = useParams();  // Get the user ID from URL parameters
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('User ID is missing');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);  // Ensure you are fetching by ID
        setProfile(response.data);

        const currentUserResponse = await axios.get('/api/auth/user');
        setIsFollowing(response.data.followers.includes(currentUserResponse.data.id)); // Compare with the logged-in user
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      const url = isFollowing ? `/api/users/unfollow/${id}` : `/api/users/follow/${id}`;
      await axios.post(url);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      setError('Failed to follow/unfollow user');
    }
  };

  if (error) {
    return <Navigate to="/login" />;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-6 bg-darkTeal rounded-lg shadow-lg">
      <div className="text-center">
        <img
          className="w-32 h-32 rounded-full mx-auto"
          src={profile.profilePicture || 'default-avatar.png'}
          alt={`${profile.username}'s profile`}
        />
        <h2 className="text-3xl font-bold text-white mt-4">{profile.username}</h2>
        <p className="text-teal mt-2">{profile.bio}</p>
        <div className="mt-4">
          <h3 className="text-xl text-white font-semibold">Favorite Genres</h3>
          <ul className="text-teal">
            {profile.favoriteGenres && profile.favoriteGenres.map((genre, index) => (
              <li key={index}>{genre}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleFollow}
          className={`mt-4 py-2 px-4 rounded font-semibold ${isFollowing ? 'bg-red-500' : 'bg-purple'} text-white hover:bg-opacity-75 transition-colors`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
