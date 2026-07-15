const brokerModel = require("../../models/broker.model");



async function profile(req,res){

  console.log("Profile is Working.....")
  const brokerId = req.user.brokerId;

  const broker = await brokerModel.findById(brokerId);
  if(!broker){

    return res.status(400).json({
      success :false,
      message:"Something went wrong!!"
    })
  }

  return res.status(200).json({
    success :true,
    message:"Broker profile",
    broker
  })
  
} 

module.exports = profile;