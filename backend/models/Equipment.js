const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true },
});

const equipmentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Tractor',
        'Harvester',
        'Seeder',
        'Water Pump',
        'Plough',
        'Thresher',
        'Rotavator',
        'Sprayer',
        'Other',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: 0,
    },
    photos: [
      {
        type: String,
      },
    ],
    village: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    availability: [availabilitySchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ownerPhone: {
      type: String,
      trim: true,
    },
    ownerWhatsapp: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

equipmentSchema.index({ location: '2dsphere' });
equipmentSchema.index({ district: 1, category: 1 });
equipmentSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Equipment', equipmentSchema);
