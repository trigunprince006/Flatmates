const express = require('express');
const router = express.Router()
const userController = require('../controllers/user.controller')



router.post('/register',userController.registerUser)
router.post('/generate-otp',userController.generateOtp)
router.post('/verify-otp',userController.verifyOtp)

module.exports = router;