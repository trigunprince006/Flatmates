const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/multer')

const {getProfile,updateProfileImg , updateUserInfo}= require('../controllers/auth/profile.controller')

router.get('/profile',authMiddleware,getProfile);
router.put('/profile/update',authMiddleware,updateUserInfo);
router.put('/profile/update-profile-image',authMiddleware,upload.single('profileImg'),updateProfileImg);

//upload.single(profileImg) profileImg is fieldname  that mean what are you sending from frontend  it consist that name there. 

module.exports = router;