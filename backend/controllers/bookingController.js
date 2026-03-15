const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const { sendNotification } = require('../utils/notification');

// Helper to count days between two dates (inclusive)
const countDays = (start, end) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((new Date(end) - new Date(start)) / msPerDay) + 1;
};

// @desc    Create booking request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { equipmentId, startDate, endDate, message } = req.body;

    const equipment = await Equipment.findById(equipmentId).populate('owner');
    if (!equipment || !equipment.isActive) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    if (equipment.owner._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot book your own equipment' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    // Check for conflicting confirmed bookings
    const conflict = await Booking.findOne({
      equipment: equipmentId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (conflict) {
      return res.status(400).json({ success: false, message: 'Equipment is not available for selected dates' });
    }

    const totalDays = countDays(start, end);
    const totalPrice = totalDays * equipment.pricePerDay;

    const booking = await Booking.create({
      equipment: equipmentId,
      renter: req.user.id,
      owner: equipment.owner._id,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice,
      message,
    });

    // Notify owner
    await sendNotification(
      equipment.owner._id,
      `New booking request from ${req.user.name} for ${equipment.name}`,
      'booking_request',
      booking._id
    );

    const populatedBooking = await Booking.findById(booking._id)
      .populate('equipment', 'name photos category')
      .populate('renter', 'name phone')
      .populate('owner', 'name phone');

    res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for current user (as renter or owner)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const { role = 'renter', status } = req.query;
    const query = {};

    if (role === 'owner') {
      query.owner = req.user.id;
    } else {
      query.renter = req.user.id;
    }

    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('equipment', 'name photos category pricePerDay')
      .populate('renter', 'name phone village')
      .populate('owner', 'name phone village')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('equipment', 'name photos category pricePerDay ownerPhone ownerWhatsapp')
      .populate('renter', 'name phone village district')
      .populate('owner', 'name phone village district');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner = booking.owner._id.toString() === req.user.id;
    const isRenter = booking.renter._id.toString() === req.user.id;

    if (!isOwner && !isRenter) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (owner confirms/cancels)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, ownerResponse } = req.body;
    const validStatuses = ['confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id).populate('equipment', 'name');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner = booking.owner.toString() === req.user.id;
    const isRenter = booking.renter.toString() === req.user.id;

    if (!isOwner && !isRenter) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only owner can confirm/complete; renter or owner can cancel
    if ((status === 'confirmed' || status === 'completed') && !isOwner) {
      return res.status(403).json({ success: false, message: 'Only owner can confirm or complete booking' });
    }

    booking.status = status;
    if (ownerResponse) booking.ownerResponse = ownerResponse;
    await booking.save();

    // Notify the other party
    const notifyUserId = isOwner ? booking.renter : booking.owner;
    const notifType = status === 'confirmed' ? 'booking_confirmed' : 'booking_cancelled';
    await sendNotification(
      notifyUserId,
      `Your booking for ${booking.equipment.name} has been ${status}`,
      notifType,
      booking._id
    );

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookings, getBookingById, updateBookingStatus };
