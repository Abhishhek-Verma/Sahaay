const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// Clerk authentication middleware - Configured to verify JWT tokens
const requireAuth = ClerkExpressRequireAuth({
  // Clerk automatically uses CLERK_SECRET_KEY from env
  onError: (error) => {
    console.error('Clerk auth error:', error.message);
  }
});

// Middleware to attach user from database
const attachUser = async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find or create user in our database
    let user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      // Create new user if doesn't exist
      const sessionClaims = req.auth.sessionClaims || {};
      user = await User.create({
        clerkId: req.auth.userId,
        email: sessionClaims.email || sessionClaims.email_address || 'unknown@email.com',
        name: sessionClaims.name || sessionClaims.first_name || sessionClaims.full_name || 'User',
        role: null, // Role will be set during registration
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Role-based authorization middleware
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};

// Optional auth (doesn't require authentication but attaches user if available)
const optionalAuth = async (req, res, next) => {
  try {
    if (req.auth?.userId) {
      const user = await User.findOne({ clerkId: req.auth.userId });
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next(); // Continue even if user lookup fails
  }
};

module.exports = {
  requireAuth,
  attachUser,
  requireRole,
  optionalAuth,
};
