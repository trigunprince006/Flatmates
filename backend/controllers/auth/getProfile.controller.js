const userModel = require('../../models/user.model')

async function getProfile(req,res){

  try {

  const id = req.user.userId
  
  const user = await userModel.findById(id)

  if(!user){
    return res.json({
      status:400,
      message:"User does not exist"
    })
  }
   return res.json({
      status:200,
      user
    })
    
  } catch (error) {
    console.log(error)
    return res.json({
      status:500,
      message:"Server error happened"
    })
  }


}

module.exports = getProfile;