const Review = require('../models/Review');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { sendNotification } = require('../utils/notification');

// Helper: recalculate average rating for equipment
const recalcEquipmentRating = async (equipmentId) => {
  const stats = await Review.aggregate([
    { $match: { equipment: equipmentId } },
    { $group: { _id: '$equipment', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Equipment.findByIdAndUpdate(equipmentId, {
      averageRating: Math.round(stats[0].avg * 10) / 10,
      totalRatings: stats[0].count,
    });
  } else {
    await Equipment.findByIdAndUpdate(equipmentId, { averageRating: 0, totalRatings: 0 });
  }
};

// @desc    Create a review for equipment
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { equipmentId, rating, comment, bookingId } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment || !equipment.isActive) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    if (equipment.owner.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot review your own equipment' });
    }

    // Verify user has a completed booking for this equipment
    const bookingQuery = {
      equipment: equipmentId,
      renter: req.user.id,
      status: 'completed',
    };
    if (bookingId) bookingQuery._id = bookingId;

    const booking = await Booking.findOne(bookingQuery);
    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'You can only review equipment you have rented and completed',
      });
    }

    const existingReview = await Review.findOne({ reviewer: req.user.id, equipment: equipmentId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this equipment' });
    }

    const review = await Review.create({
      reviewer: req.user.id,
      equipment: equipmentId,
      booking: booking._id,
      rating: Number(rating),
      comment,
    });

    await recalcEquipmentRating(equipment._id);

    // Notify equipment owner
    await sendNotification(
      equipment.owner,
      `${req.user.name} left a ${rating}-star review on your ${equipment.name}`,
      'review',
      review._id
    );

    const populated = await Review.findById(review._id).populate('reviewer', 'name village');
    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for equipment
// @route   GET /api/reviews/equipment/:equipmentId
// @access  Public
const getEquipmentReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ equipment: req.params.equipmentId })
      .populate('reviewer', 'name village profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getEquipmentReviews };
