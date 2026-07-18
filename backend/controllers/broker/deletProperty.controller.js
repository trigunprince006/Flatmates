const { default: mongoose } = require("mongoose");
const propertyModel = require("../../models/property.model")

async function deleteProperty(req,res){

  try {
    const {propertyId} = req.query;
    if(!propertyId){

      return res.status(400).json({
        success:false,
        message:"Property  id is not provided"
      })
    }

    if(!mongoose.isValidObjectId(propertyId)){
      return res.status(400).json({
        success:false,
        message:"PropertyId is not Valid"
      })
    }

    await propertyModel.findByIdAndDelete(propertyId);
    return res.status(200).json({
        success:true,
        message:"Property deleted successfully"
      })


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Internal server error!"
    })
  }

}

module.exports = deleteProperty;