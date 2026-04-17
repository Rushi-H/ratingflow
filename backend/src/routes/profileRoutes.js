const express = require('express');
const { changePassword } = require('../controllers/profileController');
const { validatePasswordChange } = require('../middleware/validation');

const router = express.Router();

router.put('/password', validatePasswordChange, changePassword);

module.exports = router;
