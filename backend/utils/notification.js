const User = require('../models/User');

/**
 * Add an in-app notification to a user's notifications array.
 * @param {string|ObjectId} userId
 * @param {string} message
 * @param {string} type  - booking_request | booking_confirmed | booking_cancelled | review
 * @param {string|ObjectId} relatedId
 */
const sendNotification = async (userId, message, type, relatedId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $push: {
        notifications: {
          message,
          type,
          relatedId,
          isRead: false,
          createdAt: new Date(),
        },
      },
    });
  } catch (err) {
    // Notifications are non-critical; log but don't crash
    console.error('Failed to send notification:', err.message);
  }
};

module.exports = { sendNotification };
