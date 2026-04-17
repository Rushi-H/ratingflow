const express = require('express');
const { getRatings, getStats } = require('../controllers/storeOwnerController');

const router = express.Router();

router.get('/ratings', getRatings);
router.get('/stats', getStats);

module.exports = router;
