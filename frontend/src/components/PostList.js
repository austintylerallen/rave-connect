// PostList.js
import React from 'react';
import Post from './Post';

const PostList = ({ posts, handleEdit, handleDelete, handleLike, handleReply }) => {
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleLike={handleLike}
            handleReply={handleReply}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">No posts available.</div>
      )}
    </div>
  );
};

export default PostList;
