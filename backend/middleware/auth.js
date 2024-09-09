// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   console.log('Token received:', token);

//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;

//     next();
//   } catch (err) {
//     console.error('Token error:', err.message);
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };


const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get the token from the header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token and extract the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user (with the ID) to req.user
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
