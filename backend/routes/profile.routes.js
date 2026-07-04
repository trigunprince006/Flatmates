const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')

const getProfileController = require('../controllers/auth/getProfile.controller')

router.get('/profile',authMiddleware,getProfileController);

module.exports = router;