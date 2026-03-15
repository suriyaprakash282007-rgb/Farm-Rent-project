const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const auth = require('../middleware/auth');

// POST /api/bookings
router.post('/', auth, async (req, res, next) => {
  try {
    const { equipment_id, start_date, end_date, message } = req.body;

    if (!equipment_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'equipment_id, start_date, and end_date are required.' });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    if (start >= end) {
      return res.status(400).json({ error: 'end_date must be after start_date.' });
    }

    const equipment = await Equipment.findById(equipment_id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found.' });

    const booking = await Booking.create({
      equipment: equipment_id,
      renter: req.user.id,
      start_date: start,
      end_date: end,
      message,
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/my
router.get('/my', auth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ renter: req.user.id })
      .populate({
        path: 'equipment',
        select: 'name type price_per_day village district photo_url contact_phone',
      })
      .sort({ created_at: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/equipment/:id
router.get('/equipment/:id', auth, async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found.' });
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you are not the owner.' });
    }

    const bookings = await Booking.find({ equipment: req.params.id })
      .populate('renter', 'name phone village district')
      .sort({ created_at: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/bookings/:id/status
router.put('/:id/status', auth, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const booking = await Booking.findById(req.params.id).populate('equipment');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    const isOwner = booking.equipment.owner.toString() === req.user.id;
    const isRenter = booking.renter.toString() === req.user.id;

    if (!isOwner && !isRenter) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    // Only owner can confirm; both owner and renter can cancel
    if (status === 'confirmed' && !isOwner) {
      return res.status(403).json({ error: 'Only the equipment owner can confirm a booking.' });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
