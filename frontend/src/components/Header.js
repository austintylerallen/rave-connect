import React from 'react';

const Header = () => {
  return (
    <header className="bg-teal text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rave Connect</h1>
        <nav>
          <a href="/" className="hover:text-purple mx-4">Home</a>
          <a href="/events" className="hover:text-purple mx-4">Events</a>
          <a href="/profile" className="hover:text-purple mx-4">Profile</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
