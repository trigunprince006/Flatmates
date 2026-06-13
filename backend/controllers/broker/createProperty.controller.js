const propertyModel = require('../../models/property.model')
const cloudinary = require("../../config/cloudinary");


async function listProperty(req,res){
  try {
    console.log(req.body);
    const{address,bhk,type,price,bedrooms,bathroom,furnishingStatus,} = req.body;
    const images = req.file;
    if(!address||!bhk||!type||!price||!bedrooms||!bathroom||!images||!furnishingStatus){
      return res.status(400).json({
        messages:"Please, Provide all the information"
      })
    }
    const result = await cloudinary.uploader.upload(
      req.file.path
    );
      const broker = req.user.brokerId;
      const property = await propertyModel.create({
        address,
        bhk,
        price,
        bedrooms,
        bathroom,
        images:result.secure_url,
        furnishingStatus,
        type,
        listedBy:broker
      })
      return res.status(200).json({
        message:"Property listed successfully",
        PropertyDetails:property
      })
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = listProperty;