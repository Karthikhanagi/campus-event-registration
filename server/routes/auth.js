const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, generateId } = require('../models');
const { JWT_SECRET, requireAuth } = require('../middleware/auth');

// POST /api/auth/sync - create or sync user profile after sign-in
router.post('/sync', async (req, res) => {
  try {
    const { uid, name, email, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanUid = uid || `demo_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Check if user already exists
    let user = await User.findOne({ uid: cleanUid });
    if (!user) {
      user = await User.findOne({ email: normalizedEmail });
    }

    if (user) {
      // Existing user: preserve admin role if already set, or update role if supplied
      const assignedRole = user.role === 'admin' ? 'admin' : (role || user.role || 'student');
      const updated = await User.findOneAndUpdate(
        { email: normalizedEmail },
        { 
          uid: cleanUid,
          name: name || user.name,
          role: assignedRole
        },
        { new: true }
      );
      user = updated || user;
    } else {
      // New user
      user = await User.create({
        uid: cleanUid,
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: role === 'admin' ? 'admin' : 'student'
      });
    }

    // Sign JWT token
    const token = jwt.sign(
      { 
        uid: user.uid, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error in /api/auth/sync:', error);
    res.status(500).json({ error: 'Failed to synchronize user account' });
  }
});

// POST /api/auth/demo-login - fast-track login for evaluator/demo accounts
router.post('/demo-login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create on the fly if not seeded yet
      const role = normalizedEmail.includes('admin') ? 'admin' : 'student';
      user = await User.create({
        uid: `demo_${Date.now()}`,
        name: normalizedEmail.includes('admin') ? 'Admin Administrator' : 'Demo Student',
        email: normalizedEmail,
        role: role
      });
    }

    const token = jwt.sign(
      { 
        uid: user.uid, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ error: 'Demo authentication failed' });
  }
});

// GET /api/auth/me - get authenticated user's current session
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
