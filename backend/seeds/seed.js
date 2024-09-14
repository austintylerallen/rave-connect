const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./../models/Post');
const User = require('./../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB using MONGODB_URI
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    await seedData();
    mongoose.connection.close(); // Close connection when done
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Helper function to create users if needed
const createUsers = async () => {
  const existingUsers = await User.find();

  // If there are fewer than 2 users, create new ones
  if (existingUsers.length < 2) {
    const user1 = new User({
      username: 'RaveMaster',
      email: 'ravemaster@example.com',
      password: 'hashedpassword1', // Replace with properly hashed passwords
    });

    const user2 = new User({
      username: 'TechnoKing',
      email: 'technoking@example.com',
      password: 'hashedpassword2', // Replace with properly hashed passwords
    });

    await user1.save();
    await user2.save();

    return [user1, user2];
  }

  // If enough users already exist, return the first two
  return [existingUsers[0], existingUsers[1]];
};

// Function to prepare seed data for posts
const seedPosts = async (users) => {
  return [
    {
      user: users[0]._id, // Reference user1's ID
      text: "Excited for the underground rave this weekend!",
      content: "I can't wait to dance all night to deep house and techno vibes. Who else is going?",
      comments: [
        {
          user: users[1]._id, // Reference user2's ID in comment
          text: "I’m definitely going! Let’s link up and enjoy the beats!"
        },
        {
          user: users[0]._id,
          text: "Sounds good! I’ll bring the glow sticks."
        }
      ]
    },
    {
      user: users[1]._id,
      text: "Just released my latest techno mix!",
      content: "It’s 90 minutes of dark, hypnotic techno. Let me know what you think, and drop a like!",
      comments: [
        {
          user: users[0]._id,
          text: "Bro, that mix was fire! Track 3 was a banger."
        },
        {
          user: users[1]._id,
          text: "Glad you liked it! That track is one of my favorites."
        }
      ]
    }
  ];
};

// Function to insert posts into the database
const insertPosts = async (posts) => {
  try {
    // Remove existing posts if necessary
    await Post.deleteMany({});
    console.log('Existing posts removed.');

    // Insert seed data into the 'posts' collection
    await Post.insertMany(posts);
    console.log('Posts seeded successfully.');
  } catch (err) {
    console.error('Error seeding posts:', err);
  }
};

// Function to seed the posts collection
async function seedData() {
  try {
    // Get or create users
    const users = await createUsers();

    // Get post data to seed
    const posts = await seedPosts(users);

    // Insert the posts into the database
    await insertPosts(posts);
  } catch (err) {
    console.error('Error in seedData function:', err);
  }
}
