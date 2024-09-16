const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate a JWT token with profile information
const generateToken = (user) => {
  return jwt.sign(
    {
      user: {
        id: user._id, // Include user ID in the JWT payload
        email: user.email, // Optionally include the email
        username: user.username, // Include the username
        profilePicture: user.profilePicture, // Include the profile picture
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: '5h' } // Token expiration time
  );
};

// Registration
// Registration Controller
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate a token after successful registration
    const token = generateToken(user);  // Call your generateToken function to create the JWT

    // Return the token in the response
    res.status(201).json({ msg: 'User registered successfully', token });  // Send the token along with the message
  } catch (err) {
    console.error('Error in registration:', err.message);
    res.status(500).send('Server error');
  }
};



// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Log the passwords being compared
    console.log('Plain-text password:', password);  // The password entered by the user
    console.log('Hashed password from DB:', user.password);  // The hashed password from the database

    // Compare the plain-text password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // Log the result of the comparison
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (password mismatch)' });
    }

    // Generate token on successful login
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
};



// Get user data (requires token)
exports.getUser = async (req, res) => {
  try {
    // Find the user by ID from the JWT token
    const user = await User.findById(req.user.id).select('-password'); // Exclude the password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err.message);
    res.status(500).send('Server error');
  }
};
