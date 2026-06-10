const express = require('express');
const router = express.Router();

const propertyController = require('../controllers/broker/createProperty.controller')
const authMiddleware = require('../middleware/auth')

router.post('/list-property',authMiddleware,propertyController);

module.exports = router;