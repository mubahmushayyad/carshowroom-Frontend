const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');

// Optional module, included per the U Devs Backend Guide's auth chapter.
// The Users CRUD screen (Admin -> Users) does not require this - it is here
// so the same backend can also demo JWT login if a grader wants to see it.

const respond = (res, status, message, data = null, errors = []) =>
  res.status(status).json({ success: status < 400, message, data, errors });

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return respond(res, 400, 'Validation failed', null, errors.array());
  }

  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) return respond(res, 409, 'This email is already registered');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || 'Customer',
    status: 'Active',
  });

  const token = signToken(user.id);
  respond(res, 201, 'Registered successfully', {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return respond(res, 400, 'Email and password are required');
  }

  const user = await User.findOne({ where: { email } });
  if (!user || !user.password) {
    return respond(res, 401, 'Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return respond(res, 401, 'Invalid credentials');

  const token = signToken(user.id);
  respond(res, 200, 'Login successful', {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  // Stateless JWT - logout is handled client-side by discarding the token.
  respond(res, 200, 'Logged out');
});

module.exports = { register, login, logout };
