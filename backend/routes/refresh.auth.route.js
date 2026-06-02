express = require('express');
const router = express.Router()
const userController = require('../controllers/user.controller')


router.post('/refresh-token',userController.refreshToken);

module.exports = router;