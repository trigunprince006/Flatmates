const express = require('express');
const router = express.Router();
//Importing controllers
const propertyController = require('../controllers/broker/createProperty.controller')
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/multer')
const getAllPropertyController = require('../controllers/user/properties.controller')

//Rouetes
router.post('/list-property',authMiddleware,upload.array('images',20),propertyController);

router.get('/property',getAllPropertyController)


module.exports = router;