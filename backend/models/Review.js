const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
