const express = require('express');
const ownerController = require('../controllers/ownerController');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, allowRoles('store_owner'));

router.get('/dashboard', asyncHandler(ownerController.dashboard));

module.exports = router;
