const cron = require('node-cron');
const mongoose = require('mongoose');
const Event = require('../models/Event');

// Connect to MongoDB (you may have already done this in your app.js or server.js)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected for cleanup job'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Schedule the job to run every day at midnight as a backup cleanup
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    
    // Delete any events that should have been removed by TTL but are still in the database
    await Event.deleteMany({ deleteAt: { $lt: now } });

    console.log('Old events backup cleanup job ran successfully');
  } catch (err) {
    console.error('Error running cleanup job:', err.message);
  }
});
