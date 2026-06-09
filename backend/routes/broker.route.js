const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth')
const brokerController = require('../controllers/broker/broker.register.controller')

const loginController = require('../controllers/broker/login.controller')

// const logoutController = require('../controllers/broker/')
const refreshTokenController = require('../controllers/broker/refreshToken.controller')

router.post('/register',brokerController.registerBroker);
router.post('/send-otp',brokerController.generateOtp);
router.post('/verify-otp',brokerController.verifyOtp);

router.post('/login',loginController);

// router.post('/logout',authMiddleware,logoutController)

router.post('/refresh-token',authMiddleware,refreshTokenController)

module.exports=router;