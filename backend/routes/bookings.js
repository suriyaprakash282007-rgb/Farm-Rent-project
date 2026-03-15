const express = require('express');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/', apiLimiter, protect, createBooking);
router.get('/', apiLimiter, protect, getBookings);
router.get('/:id', apiLimiter, protect, getBookingById);
router.put('/:id/status', apiLimiter, protect, updateBookingStatus);

module.exports = router;
