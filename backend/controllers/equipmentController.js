const Equipment = require('../models/Equipment');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Get all equipment (with filters)
// @route   GET /api/equipment
// @access  Public
const getEquipment = async (req, res, next) => {
  try {
    const {
      search,
      category,
      district,
      state,
      minPrice,
      maxPrice,
      lat,
      lng,
      radius,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) query.category = category;
    if (district) query.district = new RegExp(district, 'i');
    if (state) query.state = new RegExp(state, 'i');

    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // Geo-spatial nearby search
    if (lat && lng) {
      const radiusKm = radius ? Number(radius) : 50;
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radiusKm * 1000,
        },
      };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Equipment.countDocuments(query);
    const equipment = await Equipment.find(query)
      .populate('owner', 'name phone village district averageRating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      equipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate(
      'owner',
      'name phone village district state averageRating totalRatings'
    );
    if (!equipment || !equipment.isActive) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.json({ success: true, equipment });
  } catch (error) {
    next(error);
  }
};

// @desc    Create equipment listing
// @route   POST /api/equipment
// @access  Private
const createEquipment = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      pricePerDay,
      village,
      district,
      state,
      lat,
      lng,
      ownerPhone,
      ownerWhatsapp,
    } = req.body;

    const photos = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const equipmentData = {
      owner: req.user.id,
      name,
      category,
      description,
      pricePerDay: Number(pricePerDay),
      photos,
      village,
      district,
      state,
      ownerPhone: ownerPhone || req.user.phone,
      ownerWhatsapp: ownerWhatsapp || req.user.phone,
    };

    if (lat && lng) {
      equipmentData.location = {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      };
    }

    const equipment = await Equipment.create(equipmentData);

    res.status(201).json({ success: true, equipment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private
const updateEquipment = async (req, res, next) => {
  try {
    let equipment = await Equipment.findById(req.params.id);
    if (!equipment || !equipment.isActive) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }

    const {
      name,
      category,
      description,
      pricePerDay,
      village,
      district,
      state,
      lat,
      lng,
      ownerPhone,
      ownerWhatsapp,
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (pricePerDay) updateData.pricePerDay = Number(pricePerDay);
    if (village) updateData.village = village;
    if (district) updateData.district = district;
    if (state) updateData.state = state;
    if (ownerPhone) updateData.ownerPhone = ownerPhone;
    if (ownerWhatsapp) updateData.ownerWhatsapp = ownerWhatsapp;

    if (lat && lng) {
      updateData.location = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
    }

    if (req.files && req.files.length > 0) {
      updateData.photos = req.files.map((f) => `/uploads/${f.filename}`);
    }

    equipment = await Equipment.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, equipment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete equipment (soft delete)
// @route   DELETE /api/equipment/:id
// @access  Private
const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment || !equipment.isActive) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    equipment.isActive = false;
    await equipment.save();

    res.json({ success: true, message: 'Equipment listing removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment availability calendar
// @route   PUT /api/equipment/:id/availability
// @access  Private
const updateAvailability = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment || !equipment.isActive) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { availability } = req.body;
    if (!Array.isArray(availability)) {
      return res.status(400).json({ success: false, message: 'Availability must be an array' });
    }

    equipment.availability = availability;
    await equipment.save();

    res.json({ success: true, availability: equipment.availability });
  } catch (error) {
    next(error);
  }
};

// @desc    Get equipment by owner
// @route   GET /api/equipment/my-listings
// @access  Private
const getMyListings = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({ owner: req.user.id, isActive: true }).sort({
      createdAt: -1,
    });
    res.json({ success: true, equipment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  updateAvailability,
  getMyListings,
};
