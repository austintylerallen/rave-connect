const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TimelinePost = require('./../models/TimelinePost');
const User = require('./../models/User'); // Assuming you have a User model

// Load environment variables
dotenv.config();

// Connect to MongoDB using MONGODB_URI
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    await seedTimeline();
    mongoose.connection.close(); // Close connection when done
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Sample timeline seed data
const seedData = async () => {
  // Fetch a valid user from the database to associate with the posts
  const user = await User.findOne(); // Assuming there's at least one user in the database

  if (!user) {
    console.error('No user found in the database. Cannot proceed with seeding.');
    process.exit(1); // Exit if no user is found
  }

  return [
    {
      user: user._id, // Reference the user's ID
      text: "Can't wait for EDC Las Vegas next month!",
      content: "Is anyone else going to EDC Las Vegas? I'm so hyped for the lineup! 💜 My rave fam and I are ready to dance for three days straight under the neon sky. I’m especially excited for Fisher’s set. Anyone planning on camping there or getting a hotel?",
      comments: [
        {
          user: user._id, // Reference the user's ID in comments
          text: "Camping all the way! Nothing beats waking up right there in the middle of the action."
        },
        {
          user: user._id,
          text: "Hotel for me, I need a real bed after hours of raving lol. Are you going for the after-parties?"
        }
      ]
    },
    {
      user: user._id,
      text: "New Techno Track Release",
      content: "Just dropped my latest techno track ‘Eclipse’. Spent months perfecting the deep bass and melodic transitions. Would love for you all to check it out! Available now on all platforms. What do you guys think?",
      comments: [
        {
          user: user._id,
          text: "Bro, the transition at 2:15 is sick! That buildup gave me chills. 👌"
        },
        {
          user: user._id,
          text: "Perfect track for my workout playlist. Keep up the great work!"
        }
      ]
    }
  ];
};

// Function to seed the timeline
async function seedTimeline() {
  try {
    // Remove existing data if needed
    await TimelinePost.deleteMany({});
    console.log('Existing timeline posts removed.');

    // Insert seed data
    const data = await seedData(); // Fetch seed data with user ID
    await TimelinePost.insertMany(data);
    console.log('Timeline seeded successfully.');
  } catch (err) {
    console.error('Error seeding timeline:', err);
  }
}
