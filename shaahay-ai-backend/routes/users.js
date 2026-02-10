const express = require('express');
const { requireAuth, attachUser, requireRole } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Sync user with Clerk
router.post('/sync', requireAuth, attachUser, async (req, res) => {
  try {
    const { role, name, ...userData } = req.body;

    // Update user information
    if (name) req.user.name = name;
    Object.assign(req.user, userData);
    
    // Allow role update if not set or if explicitly provided
    if (role && (!req.user.role || req.user.role === 'student')) {
      req.user.role = role;
    }

    await req.user.save();

    res.json({ 
      success: true, 
      user: {
        id: req.user._id,
        clerkId: req.user.clerkId,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Get current user profile
router.get('/me', requireAuth, attachUser, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', requireAuth, attachUser, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'avatar', 'department', 'year', 'specialization', 'availableHours'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(req.user, updates);
    await req.user.save();

    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all users (admin only)
router.get('/', requireAuth, attachUser, requireRole('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(query).select('-__v');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all counselors (accessible by students)
router.get('/counselors', requireAuth, attachUser, async (req, res) => {
  try {
    const counselors = await User.find({ 
      role: 'counselor',
      isActive: true 
    }).select('name email specialization availableHours avatar');
    
    res.json({ counselors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch counselors' });
  }
});

// Update user role (admin only)
router.patch('/:userId/role', requireAuth, attachUser, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!['student', 'counselor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

module.exports = router;
