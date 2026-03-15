const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Equipment = require('../models/Equipment');
const auth = require('../middleware/auth');

// POST /api/reviews
router.post('/', auth, async (req, res, next) => {
  try {
    const { equipment_id, rating, comment } = req.body;

    if (!equipment_id || !rating) {
      return res.status(400).json({ error: 'equipment_id and rating are required.' });
    }

    const equipment = await Equipment.findById(equipment_id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found.' });

    const review = await Review.create({
      equipment: equipment_id,
      reviewer: req.user.id,
      rating: Number(rating),
      comment,
    });

    // Recalculate average rating
    const allReviews = await Review.find({ equipment: equipment_id });
    const total = allReviews.length;
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / total;

    equipment.average_rating = Math.round(avg * 10) / 10;
    equipment.total_reviews = total;
    await equipment.save();

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// GET /api/reviews/equipment/:id
router.get('/equipment/:id', async (req, res, next) => {
  try {
    const reviews = await Review.find({ equipment: req.params.id })
      .populate('reviewer', 'name')
      .sort({ created_at: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
