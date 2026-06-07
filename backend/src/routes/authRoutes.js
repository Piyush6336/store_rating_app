const express = require('express');
const authController = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', asyncHandler(authController.signup));
router.post('/login', asyncHandler(authController.login));
router.patch('/password', requireAuth, asyncHandler(authController.updatePassword));

module.exports = router;
