const express = require('express');
const storeController = require('../controllers/storeController');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, allowRoles('user'));

router.get('/', asyncHandler(storeController.listStores));
router.post('/:id/rating', asyncHandler(storeController.submitRating));

module.exports = router;
