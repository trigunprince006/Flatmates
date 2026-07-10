const { default: mongoose } = require("mongoose");
const brokerModel =  require("../../models/broker.model");

async function getBrokerById(req,res){

  try {
 
  const brokerId = req.query.id;
  // console.log("brokerId:",brokerId);
  if(!mongoose.isValidObjectId(brokerId)){
    return res.status(400).json({
      success:false,
      message:"Invalid broker id !!!"
    })
  }
  const broker = await brokerModel.findById(brokerId);

  if(!broker){
    return res.status(400).json({
      success : false,
      message:"Broker Id is May be broken "
    })
  }
  return res.status(200).json({
      success : true,
      broker
    })

  } catch (error) {
    
    console.log(error)
    return res.status(500).json({
      success : false,
      message:"Internal server error"
    })
  }

}

module.exports = getBrokerById;