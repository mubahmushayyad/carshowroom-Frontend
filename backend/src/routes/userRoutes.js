const express = require('express');
const { body } = require('express-validator');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// Mirrors the exact contract the frontend's src/services/userApi.js already
// calls (GET/POST /api/users, PUT/DELETE /api/users/:id) - see README.md
// "Redux User Management Module" section.

const userValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['Admin', 'Sales Manager', 'Inventory Manager', 'Customer'])
    .withMessage('Invalid role'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
];

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', userValidation, createUser);
router.put('/:id', userValidation, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
