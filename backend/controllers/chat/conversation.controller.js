const conversationModel = require('../../models/conversation.model');
const userModel = require('../../models/user.model');

async function createMassage(req,res){

  try {
    // console.log(req.body)
    const{byWhom,toWhom,messages} = req.body;

    if(!byWhom||!toWhom||!messages){
      return res.status(400).json({
        message:"Please fill all filed"
      })
    }
    console.log(req.user)
    const brokerId = req.user.userId;
    console.log("brokerId",brokerId);
    //abhi fullname se find kro jab username functionalities add krunga tab username se find hoga
    const fullname = toWhom;
    const isUserExist = await userModel.findOne({fullname})
    // console.log(isUserExist)

    if(!isUserExist){
      return res.status(400).json({
        message:"user not found"
      })
    }
    const userId = isUserExist._id;
    console.log(userId)
    const message = await conversationModel.create({
      userId:userId,
      brokerId:brokerId,
      messages
    })
    return res.status(201).json({
      message:"Message sent successfully",
      message
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal server error!!!"
    })
  }
}

module.exports = createMassage;