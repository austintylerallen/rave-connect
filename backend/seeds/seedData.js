const mongoose = require('mongoose');

// Define Mongoose schema for a simple Post
const postSchema = new mongoose.Schema({
  text: String,
  user: String,
  date: { type: Date, default: Date.now },
});

// Define the Post model
const Post = mongoose.model('Post', postSchema);

// Use the MongoDB URI from environment variable or fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

// Connect to MongoDB (using the URI that now includes the 'test' database)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed function
async function seed() {
  try {
    // Clear existing data in the posts collection
    await Post.deleteMany({});
    console.log('Cleared posts collection.');

    // Insert sample data
    const posts = await Post.insertMany([
      { text: 'First post by user1', user: 'user1' },
      { text: 'Second post by user2', user: 'user2' },
    ]);

    console.log(`Seeded ${posts.length} posts`);
    console.log('Sample posts data:', posts);

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error seeding the database:', err);
    mongoose.connection.close();
  }
}

seed();
