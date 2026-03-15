const express = require('express');
const { createReview, getEquipmentReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/equipment/:equipmentId', getEquipmentReviews);

module.exports = router;
