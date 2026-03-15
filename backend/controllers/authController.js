const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, password, village, district, state, lat, lng } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const userData = { name, email, phone, password, village, district, state };
    if (lat && lng) {
      userData.location = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        village: user.village,
        district: user.district,
        state: user.state,
        averageRating: user.averageRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        village: user.village,
        district: user.district,
        state: user.state,
        averageRating: user.averageRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, village, district, state, lat, lng } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (village) updateData.village = village;
    if (district) updateData.district = district;
    if (state) updateData.state = state;
    if (lat && lng) {
      updateData.location = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user notifications
// @route   GET /api/auth/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/auth/notifications/:notifId/read
// @access  Private
const markNotificationRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const notif = user.notifications.id(req.params.notifId);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    notif.isRead = true;
    await user.save();
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, getNotifications, markNotificationRead };
