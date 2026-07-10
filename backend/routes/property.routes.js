const express = require('express');
const router = express.Router();

//Importing controllers
const propertyController = require('../controllers/broker/createProperty.controller')
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/multer')
const {getAllProperty,getPropertyById} = require('../controllers/user/properties.controller')

// Routes
router.post('/list-property',authMiddleware,upload.array('images',20),propertyController);

router.get('/property',getAllProperty)

router.get("/house/id",getPropertyById);

module.exports = router;