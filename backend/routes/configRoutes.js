const express = require('express');
const { getPublicConfig } = require('../controllers/configController');

const router = express.Router();

router.route('/').get(getPublicConfig);

module.exports = router;
