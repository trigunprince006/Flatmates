const userModel = require("../../models/user.model");
const cloudinary = require('../../config/cloudinary')

async function getProfile(req, res) {
  try {
    const userId = req.user.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        success : false,
        message: "User does not exist",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error happened",
    });
  }
}

async function updateUserInfo(req, res) {
  try {
    const { fullname, jobRole, age, relationshipStatus } = req.body;

    const id = req.user.userId;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not verified",
      });
    }
    user.fullname = fullname;
    user.userProfile.age = age;
    user.userProfile.jobRole = jobRole;
    user.userProfile.relationshipStatus = relationshipStatus;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User info updated ",
    });

  }
   catch (error) {

    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Internal server error!"
    })
  }

}

async function updateProfileImg(req,res){

  try {
    
    const id = req.user.userId;
    const profileImg = req.file;

    if(!profileImg){
      return res.status(400).json({
      success:false,
      message:"Please provide image url"
     })
    }

    const user = await userModel.findById(id)
    if(!user){
      return res.status(401).json({
      success:false,
      message:"Not authorized person"
     })
    }
    
    const result = await cloudinary.uploader.upload(profileImg.path)
    
    user.userProfile.profilePhoto = result.secure_url;
    await user.save();

    return res.status(200).json({
      success:false,
      message:"Profile pic updated successfully!"
     })


  } catch (error) {

    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Internal server error!"
    })
  }

}


module.exports = { getProfile, updateUserInfo ,updateProfileImg };
