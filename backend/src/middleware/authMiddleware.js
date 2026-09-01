const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User } = require('../models');

// Verifies the Bearer token and attaches the authenticated user to req.user.
// Never trust an id/role sent by the client - identity always comes from
// the verified token.
const isAuthenticated = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    res.status(401);
    throw new Error('Not authenticated');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      res.status(401);
      throw new Error('User no longer exists');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
});

// Optional role guard, e.g. router.delete('/:id', isAuthenticated, allowRoles('Admin'), ...)
const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Not authorized for this action');
  }
  next();
};

module.exports = { isAuthenticated, allowRoles };
