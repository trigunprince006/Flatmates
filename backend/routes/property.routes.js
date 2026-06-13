const express = require('express');
const router = express.Router();

const propertyController = require('../controllers/broker/createProperty.controller')
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/multer')

router.post('/list-property',authMiddleware,upload.single('images'),propertyController);

module.exports = router;