const express = require('express');
const { getStores, createRating, updateRating } = require('../controllers/userController');

const router = express.Router();

router.get('/stores', getStores);
router.post('/ratings', createRating);
router.put('/ratings/:id', updateRating);

module.exports = router;
