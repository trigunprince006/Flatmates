const express = require('express');
const router = express.Router();

//Importing controllers
const propertyController = require('../controllers/broker/createProperty.controller')
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/multer')
const {getAllProperty,getPropertyById} = require('../controllers/user/properties.controller');
const editProperty = require('../controllers/broker/editProperty.controller');
const deleteProperty = require('../controllers/broker/deletProperty.controller');

// Routes
router.post('/list-property',authMiddleware,upload.array('images',20),propertyController);
router.put('/edit-property',authMiddleware,upload.array('images',20),editProperty);
router.delete('/delete-property',authMiddleware,deleteProperty);
router.get('/property',getAllProperty)

router.get("/house/id",getPropertyById);

module.exports = router;