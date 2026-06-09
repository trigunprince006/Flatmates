const express = require('express');
const router = express.Router();

const brokerController = require('../controllers/broker/broker.register.controller')

router.post('/register',brokerController.registerBroker);
router.post('/send-otp',brokerController.generateOtp);
router.post('/verify-otp',brokerController.verifyOtp);

module.exports=router;