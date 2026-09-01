const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { User } = require('../models');

// Shared response envelope: { success, message, data, errors }
// The frontend's userApi.js `unwrap()` already understands this shape,
// so no changes were needed on the frontend to plug this backend in.
const respond = (res, status, message, data = null, errors = []) =>
  res.status(status).json({ success: status < 400, message, data, errors });

// GET /api/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'ASC']],
  });
  respond(res, 200, 'Users fetched', users);
});

// GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) return respond(res, 404, 'User not found');
  respond(res, 200, 'User fetched', user);
});

// POST /api/users
const createUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return respond(res, 400, 'Validation failed', null, errors.array());
  }

  const { name, email, role, status } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return respond(res, 409, 'This email is already registered');
  }

  const user = await User.create({ name, email, role, status: status || 'Active' });
  const safeUser = user.toJSON();
  delete safeUser.password;

  respond(res, 201, 'User created', safeUser);
});

// PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return respond(res, 400, 'Validation failed', null, errors.array());
  }

  const user = await User.findByPk(req.params.id);
  if (!user) return respond(res, 404, 'User not found');

  const { name, email, role, status } = req.body;

  if (email && email !== user.email) {
    const existing = await User.findOne({ where: { email } });
    if (existing) return respond(res, 409, 'This email is already registered');
  }

  await user.update({
    name: name ?? user.name,
    email: email ?? user.email,
    role: role ?? user.role,
    status: status ?? user.status,
  });

  const safeUser = user.toJSON();
  delete safeUser.password;

  respond(res, 200, 'User updated', safeUser);
});

// DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return respond(res, 404, 'User not found');

  await user.destroy();
  respond(res, 200, 'User deleted', { id: req.params.id });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
