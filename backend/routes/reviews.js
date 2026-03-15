const express = require('express');
const { createReview, getEquipmentReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/', apiLimiter, protect, createReview);
router.get('/equipment/:equipmentId', apiLimiter, getEquipmentReviews);

module.exports = router;
