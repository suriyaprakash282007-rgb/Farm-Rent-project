const express = require('express');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
