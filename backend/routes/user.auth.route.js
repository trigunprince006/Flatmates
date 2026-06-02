const express = require('express');
const router = express.Router()
const userController = require('../controllers/user.controller')


router.post('/send-otp',userController.sendOtpForLogin);
router.post('/login',userController.login);

module.exports = router;