const express = require('express');
const {
  addAddress,
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All address routes are protected
router.use(protect);

router.route('/')
  .get(getAddresses)
  .post(addAddress);

router.route('/:id')
  .delete(deleteAddress);

router.route('/:id/default')
  .put(setDefaultAddress);

module.exports = router;
