const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_college_event_jwt_key_2026';

// Middleware to verify authentication token
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    
    // Decode JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find or verify user in database
      let user = await User.findOne({ uid: decoded.uid });
      if (!user) {
        user = await User.findOne({ email: decoded.email });
      }

      if (!user) {
        // Automatically sync user if decoded token has valid payload
        user = {
          uid: decoded.uid,
          name: decoded.name || 'User',
          email: decoded.email,
          role: decoded.role || 'student'
        };
      }

      req.user = user;
      next();
    } catch (jwtErr) {
      // In case client sends a raw uid/demo token
      const fallbackUser = await User.findOne({ uid: token });
      if (fallbackUser) {
        req.user = fallbackUser;
        return next();
      }
      return res.status(401).json({ error: 'Session expired or invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server authentication failure' });
  }
};

// Middleware to enforce Admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Administrator privileges required' });
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  JWT_SECRET
};
