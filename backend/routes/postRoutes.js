// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const Post = require('../models/Post');
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const dotenv = require('dotenv');

// dotenv.config();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Set up Cloudinary storage for `multer`
// const cloudinaryStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'rave-connect', // Folder in Cloudinary where images will be stored
//     allowedFormats: ['jpg', 'png'],
//   },
// });

// // Set up `multer` to use Cloudinary storage
// const upload = multer({ storage: cloudinaryStorage });

// // Create a new post with optional image
// router.post('/', auth, upload.single('image'), async (req, res) => {
//   try {
//     const { text, eventImage, eventName } = req.body;

//     if (!text) {
//       return res.status(400).json({ msg: 'Text is required' });
//     }

//     // Log the user ID to ensure it's available
//     console.log('Creating post for user:', req.user.id);

//     let imageUrl = null;
//     if (req.file) {
//       imageUrl = req.file.path;
//     }

//     const newPost = new Post({
//       text,
//       user: req.user.id,
//       imageUrl: imageUrl || null,
//       eventImage: eventImage || null,
//       eventName: eventName || null,
//     });

//     let post = await newPost.save();
//     post = await post.populate('user', 'username profilePicture'); // Populate user directly

//     res.json(post);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });



// // Get all posts
// router.get('/', async (req, res) => {
//   try {
//     // Fetch posts and populate user data
//     const posts = await Post.find()
//       .sort({ date: -1 })
//       .populate('user', 'username profilePicture'); // Ensure user is populated with these fields
    
//     res.json(posts);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });


// // Update a post
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const { text } = req.body;
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ msg: 'Post not found' });
//     }

//     // Ensure only the user who created the post can update it
//     if (post.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: 'User not authorized' });
//     }

//     post.text = text;
//     await post.save();
//     res.json(post);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Delete a post
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ msg: 'Post not found' });
//     }

//     // Ensure only the user who created the post can delete it
//     if (post.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: 'User not authorized' });
//     }

//     await post.deleteOne();
//     res.json({ msg: 'Post removed' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Like/Unlike a post
// router.post('/:id/like', auth, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ msg: 'Post not found' });
//     }

//     // Check if the post is already liked by the user
//     const likedIndex = post.likes.findIndex((like) => like.user.toString() === req.user.id);

//     if (likedIndex !== -1) {
//       // Unlike the post
//       post.likes.splice(likedIndex, 1);
//     } else {
//       // Like the post
//       post.likes.unshift({ user: req.user.id });
//     }

//     await post.save();
//     return res.json(post);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for `multer`
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rave-connect', // Folder in Cloudinary where images will be stored
    allowedFormats: ['jpg', 'png'],
  },
});

// Set up `multer` to use Cloudinary storage
const upload = multer({ storage: cloudinaryStorage });

// Create a new post with optional image
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text, eventImage, eventName } = req.body;

    if (!text) {
      return res.status(400).json({ msg: 'Text is required' });
    }

    // Check if an image was uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path; // Cloudinary stores the URL in `req.file.path`
    }

    // Create the post with optional image and event details
    const newPost = new Post({
      text,
      user: req.user.id,  // Attach the authenticated user's ID
      imageUrl: imageUrl || null, // Set the image URL if uploaded
      eventImage: eventImage || null,
      eventName: eventName || null,
    });

    let post = await newPost.save();
    post = await post.populate('user', 'username profilePicture'); // Populate user directly without execPopulate()
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    // Fetch posts and populate user data
    const posts = await Post.find()
      .sort({ date: -1 })
      .populate('user', 'username profilePicture'); // Ensure user is populated with these fields
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Ensure only the user who created the post can update it
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.text = text;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Ensure only the user who created the post can delete it
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.deleteOne();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Like/Unlike a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post is already liked by the user
    const likedIndex = post.likes.findIndex((like) => like.user.toString() === req.user.id);

    if (likedIndex !== -1) {
      // Unlike the post
      post.likes.splice(likedIndex, 1);
    } else {
      // Like the post
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
