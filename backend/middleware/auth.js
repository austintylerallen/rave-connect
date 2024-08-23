const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  
  console.log('Token received:', token); // Debugging line

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debugging line
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token error:', err.message); // Debugging line
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
