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

const router = express.Router();

router.get('/', getEquipment);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', getEquipmentById);

router.post('/', protect, upload.array('photos', 5), createEquipment);
router.put('/:id', protect, upload.array('photos', 5), updateEquipment);
router.delete('/:id', protect, deleteEquipment);
router.put('/:id/availability', protect, updateAvailability);

module.exports = router;
