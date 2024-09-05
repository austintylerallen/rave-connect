import React from 'react';
import Post from './Post';

const PostList = ({ posts, handleEdit, handleDelete, handleLike }) => {
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
          />
        ))
      ) : (
        <div>No posts available</div>
      )}
    </div>
  );
};

export default PostList;
