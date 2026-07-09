const propertyModel = require('../../models/property.model')
const brokerModel = require("../../models/broker.model")
const cloudinary = require("../../config/cloudinary");
// const { findById } = require('../../models/user.model');


async function listProperty(req,res){
  try {

    const{address,bhk,type,price,bedrooms,bathroom,furnishingStatus,} = req.body;
    const images = req.files;
    

    if(!address||!bhk||!type||!price||!bedrooms||!bathroom||!furnishingStatus){

      return res.status(400).json({
        messages:"Please, Provide all the information"
      })
    }

    const imageUrls = [];

    for (const file of req.files) {

      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);

    }
    // console.log(imageUrls)
    const id = req.user.brokerId; //broker id 
    const broker = await brokerModel.findById(id);
    const property = await propertyModel.create({
      address,
      bhk,
      price,
      bedrooms,
      bathroom,
      images:imageUrls,
      furnishingStatus,
      type,
      listedBy:broker._id,
      brokerName:broker.fullname

    })
    return res.status(200).json({
      status:200,
      message:"Property listed successfully",
      property
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status:500,
      message:"Internal server error!!!",
    })
  }

}

module.exports = listProperty;