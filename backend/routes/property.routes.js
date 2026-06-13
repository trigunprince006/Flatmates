const express = require('express');
const router = express.Router();

const propertyController = require('../controllers/broker/createProperty.controller')
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/multer')

router.post('/list-property',authMiddleware,upload.array('images',20),propertyController);

module.exports = router;