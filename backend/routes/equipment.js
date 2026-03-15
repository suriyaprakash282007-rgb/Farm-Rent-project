const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const auth = require('../middleware/auth');

// GET /api/equipment
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.district) filter.district = new RegExp(req.query.district, 'i');
    if (req.query.village) filter.village = new RegExp(req.query.village, 'i');
    if (req.query.type) filter.type = req.query.type;

    const items = await Equipment.find(filter)
      .populate('owner', 'name')
      .sort({ created_at: -1 });

    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /api/equipment
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, type, description, photo_url, price_per_day, village, district, contact_phone, whatsapp, available_dates } = req.body;

    if (!name || price_per_day === undefined || !village || !district || !contact_phone) {
      return res.status(400).json({ error: 'name, price_per_day, village, district, and contact_phone are required.' });
    }

    const equipment = await Equipment.create({
      owner: req.user.id,
      name, type, description, photo_url, price_per_day,
      village, district, contact_phone, whatsapp,
      available_dates: available_dates || [],
    });

    res.status(201).json(equipment);
  } catch (err) {
    next(err);
  }
});

// GET /api/equipment/:id
router.get('/:id', async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('owner', 'name phone village district');

    if (!equipment) return res.status(404).json({ error: 'Equipment not found.' });
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

// PUT /api/equipment/:id
router.put('/:id', auth, async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found.' });
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you are not the owner.' });
    }

    const allowed = ['name', 'type', 'description', 'photo_url', 'price_per_day', 'village', 'district', 'contact_phone', 'whatsapp', 'available_dates'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) equipment[field] = req.body[field];
    });

    await equipment.save();
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/equipment/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found.' });
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you are not the owner.' });
    }

    await equipment.deleteOne();
    res.json({ message: 'Equipment deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/equipment/:id/availability
router.post('/:id/availability', auth, async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found.' });
    if (equipment.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you are not the owner.' });
    }

    equipment.available_dates = req.body.available_dates || [];
    await equipment.save();
    res.json({ available_dates: equipment.available_dates });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
