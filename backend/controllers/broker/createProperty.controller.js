const propertyModel = require('../../models/property.model')
const cloudinary = require("../../config/cloudinary");


async function listProperty(req,res){
  try {
    // console.log(req.body);
    const{address,bhk,type,price,bedrooms,bathroom,furnishingStatus,} = req.body;
    const images = req.files;
    // console.log("images-->",images)
    // console.log("req.files--->",req.files)
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
    console.log("imageURLs-->",imageUrls)
      const broker = req.user.brokerId;
      const property = await propertyModel.create({
        address,
        bhk,
        price,
        bedrooms,
        bathroom,
        images:imageUrls,
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