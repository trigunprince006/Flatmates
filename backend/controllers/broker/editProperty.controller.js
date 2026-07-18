const propertyModel = require("../../models/property.model");
const cloudinary = require('../../config/cloudinary')

async function editProperty(req,res){

  try {
    const {propertyId} = req.query;

    const {price,bhk,bedrooms,bathroom,furnishingStatus,type,address} = req.body;
    
    if (!price ||!bhk ||!bedrooms ||!bathroom ||!furnishingStatus ||!type ||!address) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields.",
      });
    }

    const images = req.files;
    const imageUrl = [];

    for(file of req.files){
     const res =  await cloudinary.uploader.upload(file.path);
      imageUrl.push(res.secure_url)
    }

    const brokerId = req.user.brokerId;

    const isProperty = await propertyModel.findById(propertyId);
    if(!isProperty){

      return res.status(404).json({
        success:false,
        message:"Property not found."
      })
    }

    isProperty.images = imageUrl;
    isProperty.price = price;
    isProperty.bedrooms = bedrooms;
    isProperty.bathroom = bathroom,
    isProperty.type = type;
    isProperty.address = address;
    isProperty.bhk = bhk;
    isProperty.furnishingStatus = furnishingStatus;
    await isProperty.save();

    return res.status(200).json({
      success:true,
      message:"Property edited successfully!"
    })


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Server error!"
    })
  }
}

module.exports = editProperty;