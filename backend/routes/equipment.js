const express = require('express');
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  updateAvailability,
  getMyListings,
} = require('../controllers/equipmentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/', apiLimiter, getEquipment);
router.get('/my-listings', apiLimiter, protect, getMyListings);
router.get('/:id', apiLimiter, getEquipmentById);

router.post('/', apiLimiter, protect, upload.array('photos', 5), createEquipment);
router.put('/:id', apiLimiter, protect, upload.array('photos', 5), updateEquipment);
router.delete('/:id', apiLimiter, protect, deleteEquipment);
router.put('/:id/availability', apiLimiter, protect, updateAvailability);

module.exports = router;
