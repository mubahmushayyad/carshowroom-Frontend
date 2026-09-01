const express = require('express');
const { body } = require('express-validator');
const { register, login, logout } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  register
);

router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
