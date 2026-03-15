const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const signToken = (farmer) =>
  jwt.sign({ id: farmer._id, name: farmer.name }, JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, phone, village, district, password } = req.body;

    if (!name || !phone || !village || !district || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = await Farmer.findOne({ phone });
    if (existing) {
      return res.status(409).json({ error: 'Phone number already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const farmer = await Farmer.create({ name, phone, village, district, password: hashed });

    const token = signToken(farmer);
    res.status(201).json({
      token,
      user: { id: farmer._id, name: farmer.name, phone: farmer.phone, village: farmer.village, district: farmer.district },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required.' });
    }

    const farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      return res.status(401).json({ error: 'Invalid phone number or password.' });
    }

    const match = await bcrypt.compare(password, farmer.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid phone number or password.' });
    }

    const token = signToken(farmer);
    res.json({
      token,
      user: { id: farmer._id, name: farmer.name, phone: farmer.phone, village: farmer.village, district: farmer.district },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
