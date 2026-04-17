const express = require('express');
const { createUser, createStore, getStats, getStores, getUsers } = require('../controllers/adminController');
const { validateAdminUserCreate, validateStoreCreate } = require('../middleware/validation');

const router = express.Router();

router.post('/users', validateAdminUserCreate, createUser);
router.post('/stores', validateStoreCreate, createStore);
router.get('/stats', getStats);
router.get('/stores', getStores);
router.get('/users', getUsers);

module.exports = router;
