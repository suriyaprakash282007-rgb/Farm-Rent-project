const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  message: { type: String, trim: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
