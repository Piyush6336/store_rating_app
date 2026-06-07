const express = require('express');
const adminController = require('../controllers/adminController');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, allowRoles('admin'));

router.get('/dashboard', asyncHandler(adminController.dashboard));
router.post('/users', asyncHandler(adminController.createUser));
router.get('/users', asyncHandler(adminController.listUsers));
router.get('/users/:id', asyncHandler(adminController.getUserDetails));
router.post('/stores', asyncHandler(adminController.createStore));
router.get('/stores', asyncHandler(adminController.listStoresForAdmin));

module.exports = router;
