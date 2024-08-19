import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileView = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/users/${userId}`).then((response) => {
      setUser(response.data);
    });
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mx-auto mt-8 p-6 bg-darkTeal rounded-lg shadow-lg">
      <div className="flex items-center">
        <img src={user.profilePicture} alt="Profile" className="w-20 h-20 rounded-full mr-4" />
        <div>
          <h2 className="text-3xl font-bold text-white">{user.username}</h2>
          <p className="text-teal">{user.email}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-purple">Bio</h3>
        <p className="text-white mt-2">{user.bio || 'No bio provided'}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-purple">Favorite Genres</h3>
        <p className="text-white mt-2">{user.favoriteGenres.length ? user.favoriteGenres.join(', ') : 'No favorite genres specified'}</p>
      </div>
    </div>
  );
};

export default ProfileView;
