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
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Log the extracted user from the token
    console.log('Authenticated user:', req.user);

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

