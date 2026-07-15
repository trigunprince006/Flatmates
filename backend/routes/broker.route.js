const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth')
const brokerController = require('../controllers/broker/broker.register.controller')

const loginController = require('../controllers/broker/login.controller')

// const logoutController = require('../controllers/broker/')
const refreshTokenController = require('../controllers/broker/refreshToken.controller');
const changePasswordController = require('../controllers/broker/changepassword.controller');
const sendOtpForResetPasswordController = require('../controllers/broker/sendOtpForResetPassword.controller');
const resetPasswordController = require('../controllers/broker/resetpassword.controller');
const getBrokerById = require('../controllers/broker/getbrokerdetails.controller');
const profile = require('../controllers/broker/brokerprofile.controller');
const logout = require('../controllers/broker/logout.controller');
const myListedProperty = require('../controllers/broker/getMyListedProperty.controller');

router.post('/register',brokerController.registerBroker);
router.post('/send-otp',brokerController.generateOtp);
router.post('/verify-otp',brokerController.verifyOtp);

router.post('/login',loginController);
router.patch('/change-password',authMiddleware,changePasswordController);
router.post('/send-otp-reset-password',sendOtpForResetPasswordController)
router.post('/reset-password',resetPasswordController)
router.post('/logout',authMiddleware,logout)

router.post('/refresh-token',refreshTokenController)

router.get('/profile',authMiddleware,profile)
router.get('/my-listed-property',authMiddleware,myListedProperty)
//Getting Broker details by id 

router.get('/broker-details/id',getBrokerById)
module.exports=router;