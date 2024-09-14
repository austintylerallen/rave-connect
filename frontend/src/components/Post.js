// import React, { useState, useEffect } from 'react'; // Make sure to import useState and useEffect
// import axios from 'axios'; // Axios is needed for API requests

// const Post = ({ post, handleEdit, handleDelete, handleLike }) => {
//   const [replyContent, setReplyContent] = useState('');
//   const [activeReplyBox, setActiveReplyBox] = useState(null); // This will track which comment/post is being replied to
//   const [comments, setComments] = useState([]);
//   const [isImageEnlarged, setIsImageEnlarged] = useState(false);

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${post._id}`);
//         setComments(response.data);
//       } catch (err) {
//         console.error('Failed to fetch comments', err);
//       }
//     };
//     fetchComments();
//   }, [post._id]);

//   const handleReply = async (parentId = null) => {
//     if (!replyContent.trim()) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('You must be logged in to comment.');
//         return;
//       }

//       // Post the comment with the optional parentId (for nested replies)
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/comments/${post._id}`,
//         { text: replyContent, parentId }, // Send the parentId if replying to a specific comment
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setComments([...comments, response.data]);
//       setReplyContent('');
//       setActiveReplyBox(null); // Reset active reply box after submission
//     } catch (err) {
//       console.error('Error submitting comment:', err);
//     }
//   };

//   const toggleImageEnlarge = () => {
//     setIsImageEnlarged(!isImageEnlarged);
//   };

//   return (
//     <div className="mb-6 p-6 bg-darkTeal rounded-lg shadow-md">
//       {/* Post Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center">
//           <img
//             src={post.user.profilePicture || '/default-avatar.png'}
//             alt="User avatar"
//             className="w-10 h-10 rounded-full mr-3"
//           />
//           <div>
//             <p className="text-purple font-semibold">
//               {post.user.username || 'Anonymous'}
//             </p>
//             <p className="text-gray-300 text-sm">
//               {new Date(post.date).toLocaleString()}
//             </p>
//           </div>
//         </div>
//         <div>
//           <button
//             onClick={() => handleEdit(post)}
//             className="mr-3 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => handleDelete(post._id)}
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//       {/* Post Content */}
//       <p className="text-gray-100 mb-4">{post.text}</p>

//       {/* Image Display */}
//       {post.imageUrl && (
//         <div
//           className={`relative mb-4 cursor-pointer mx-auto ${isImageEnlarged ? 'w-full' : 'w-48 h-64'}`}
//           onClick={toggleImageEnlarge}
//         >
//           <img
//             src={post.imageUrl}
//             alt="Uploaded"
//             className={`object-cover rounded-lg mx-auto ${isImageEnlarged ? 'w-full h-auto' : 'w-48 h-64'}`}
//           />
//         </div>
//       )}

//       {/* Event Display if available */}
//       {post.eventName && (
//         <div className="flex justify-center mb-4">
//           <div className="bg-darkPurple p-4 rounded-lg flex flex-col items-center text-center">
//             {post.eventImage && (
//               <img
//                 src={post.eventImage}
//                 alt={post.eventName}
//                 className="w-20 h-32 object-cover rounded-lg mb-2"
//               />
//             )}
//             <h4 className="font-bold text-gray-100">{post.eventName}</h4>
//           </div>
//         </div>
//       )}

//       {/* Like and Reply Buttons */}
//       <div className="mt-4 flex items-center">
//         <button
//           onClick={() => handleLike(post._id)}
//           className="mr-3 px-4 py-2 bg-purple text-white rounded hover:bg-darkPurple transition-colors"
//         >
//           Like
//         </button>
//         <button
//           onClick={() => setActiveReplyBox(post._id)} // This will allow replying to the post itself
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//         >
//           Reply
//         </button>
//       </div>

//       {/* Reply Text Area for Post */}
//       {activeReplyBox === post._id && (
//         <div className="comment-form mt-4">
//           <textarea
//             value={replyContent}
//             onChange={(e) => setReplyContent(e.target.value)}
//             placeholder="Write a reply..."
//             className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={() => handleReply(null)} // Replying to the post, so no parentId
//             className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//           >
//             Submit Reply
//           </button>
//         </div>
//       )}

//       {/* Comments Section */}
//       <div className="comments-section mt-6">
//         {comments.map((comment) => (
//           <div key={comment._id} className="bg-gray-100 p-3 my-2 rounded-lg ml-4">
//             <div className="flex items-center mb-2">
//               <img
//                 src={comment.user?.profilePicture || '/default-avatar.png'} // Ensure comment user profile picture is accessed
//                 alt="User avatar"
//                 className="w-8 h-8 rounded-full mr-2"
//               />
//               <p className="text-gray-900">
//                 <strong>{comment.user?.username || 'Anonymous'}:</strong> {comment.text} {/* Ensure comment user username is accessed */}
//               </p>
//             </div>
//             <button
//               onClick={() => setActiveReplyBox(comment._id)} // Allow replying to specific comments
//               className="text-sm text-blue-500 mt-1"
//             >
//               Reply
//             </button>

//             {/* Reply Text Area for Comment */}
//             {activeReplyBox === comment._id && (
//               <div className="comment-form mt-4">
//                 <textarea
//                   value={replyContent}
//                   onChange={(e) => setReplyContent(e.target.value)}
//                   placeholder="Write a reply..."
//                   className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={() => handleReply(comment._id)} // Pass the comment's ID as the parentId
//                   className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//                 >
//                   Submit Reply
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Post;



import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 

const Post = ({ post, handleEdit, handleDelete, handleLike }) => {
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyBox, setActiveReplyBox] = useState(null); // Track which reply box is open
  const [comments, setComments] = useState([]);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${post._id}`);
        setComments(response.data);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      }
    };
    fetchComments();
  }, [post._id]);

  const handleReply = async (parentId = null) => {
    if (!replyContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('You must be logged in to comment.');
        return;
      }

      // Post the comment with the optional parentId (for nested replies)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comments/${post._id}`,
        { text: replyContent, parentId }, // Send the parentId if replying to a specific comment
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add the new comment with the user data to the comments list
      setComments([...comments, response.data]); // Add the returned comment from the backend
      setReplyContent('');
      setActiveReplyBox(null); // Close the reply box after submission
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const toggleImageEnlarge = () => {
    setIsImageEnlarged(!isImageEnlarged);
  };

  return (
    <div className="mb-6 p-6 bg-darkTeal rounded-lg shadow-md">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={post.user.profilePicture || '/default-avatar.png'}
            alt="User avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-purple font-semibold">
              {post.user.username || 'Anonymous'}
            </p>
            <p className="text-gray-300 text-sm">
              {new Date(post.date).toLocaleString()}
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => handleEdit(post)}
            className="mr-3 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(post._id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-100 mb-4">{post.text}</p>

      {/* Image Display */}
      {post.imageUrl && (
        <div
          className={`relative mb-4 cursor-pointer mx-auto ${isImageEnlarged ? 'w-full' : 'w-48 h-64'}`}
          onClick={toggleImageEnlarge}
        >
          <img
            src={post.imageUrl}
            alt="Uploaded"
            className={`object-cover rounded-lg mx-auto ${isImageEnlarged ? 'w-full h-auto' : 'w-48 h-64'}`}
          />
        </div>
      )}

      {/* Like and Reply Buttons */}
      <div className="mt-4 flex items-center">
        <button
          onClick={() => handleLike(post._id)}
          className="mr-3 px-4 py-2 bg-purple text-white rounded hover:bg-darkPurple transition-colors"
        >
          Like
        </button>
        <button
          onClick={() => setActiveReplyBox(post._id)} // This will allow replying to the post itself
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Reply
        </button>
      </div>

      {/* Reply Text Area for Post */}
      {activeReplyBox === post._id && (
        <div className="comment-form mt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleReply(null)} // Replying to the post, so no parentId
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Submit Reply
          </button>
        </div>
      )}

      {/* Comments Section */}
      <div className="comments-section mt-6">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-100 p-3 my-2 rounded-lg ml-4">
            <div className="flex items-center mb-2">
              <img
                src={comment.user?.profilePicture || '/default-avatar.png'} // Ensure comment user profile picture is accessed
                alt="User avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <p className="text-gray-900">
                <strong>{comment.user?.username || 'Anonymous'}:</strong> {comment.text} {/* Ensure comment user username is accessed */}
              </p>
            </div>
            <button
              onClick={() => setActiveReplyBox(comment._id)} // Allow replying to specific comments
              className="text-sm text-blue-500 mt-1"
            >
              Reply
            </button>

            {/* Reply Text Area for Comment */}
            {activeReplyBox === comment._id && (
              <div className="comment-form mt-4">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleReply(comment._id)} // Pass the comment's ID as the parentId
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Submit Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
