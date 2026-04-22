const express = require('express');
const { submitContact } = require('../controllers/contactController');

const router = express.Router();

// Public route - no auth required
router.post('/', submitContact);

module.exports = router;
