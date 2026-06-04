const express = require('express');
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const registerController = require('../controllers/auth/register.controller')
const loginController = require('../controllers/auth/login.controller')
const sendOtpController = require('../controllers/auth/sendOtpForLogin.controller')
const logoutController = require('../controllers/auth/logout.controller')
const refreshTokenController = require('../controllers/auth/refreshToken.controller')

router.post('/register',registerController.registerUser);
router.post('/generate-otp',registerController.generateOtp);
router.post('/verify-otp',registerController.verifyOtp);

router.post('/login',loginController);
router.post('/send-otp',sendOtpController);
router.post('/logout',authMiddleware,logoutController)

router.post('/refresh-token',authMiddleware,refreshTokenController)

module.exports = router;