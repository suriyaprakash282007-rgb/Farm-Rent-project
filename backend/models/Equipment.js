const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['tractor', 'harvester', 'seeder', 'pump', 'sprayer', 'other'],
    default: 'other',
  },
  description: { type: String, trim: true },
  photo_url: { type: String, trim: true },
  price_per_day: { type: Number, required: true, min: 0 },
  village: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  contact_phone: { type: String, required: true, trim: true },
  whatsapp: { type: String, trim: true },
  available_dates: [{ type: Date }],
  average_rating: { type: Number, default: 0 },
  total_reviews: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Equipment', equipmentSchema);
