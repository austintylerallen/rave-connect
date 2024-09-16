const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('../models/Post'); // Adjust the path to where your Post model is located

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('MongoDB connected');
    await deleteAllPosts();
    mongoose.connection.close(); // Close connection when done
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Function to delete all posts
const deleteAllPosts = async () => {
  try {
    const result = await Post.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} posts.`);
  } catch (err) {
    console.error('Error deleting posts:', err);
  }
};
