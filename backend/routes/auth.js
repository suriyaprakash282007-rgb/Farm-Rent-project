const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  getNotifications,
  markNotificationRead,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', apiLimiter, protect, getMe);
router.put('/profile', apiLimiter, protect, updateProfile);
router.get('/notifications', apiLimiter, protect, getNotifications);
router.put('/notifications/:notifId/read', apiLimiter, protect, markNotificationRead);

module.exports = router;
