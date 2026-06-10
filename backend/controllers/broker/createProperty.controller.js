const propertyModel = require('../../models/property.model')


async function listProperty(req,res){
  try {
    console.log(req.body)
    const{address,bhk,type,price,bedrooms,bathroom,furnishingStatus,images} = req.body;
    if(!address||!bhk||!type||!price||!bedrooms||!bathroom||!images||!furnishingStatus){
      return res.status(400).json({
        messages:"Please, Provide all the information"
      })
    }
      const broker = req.user.brokerId;
      console.log("BrokerFrom property",broker)
      const property = await propertyModel.create({
        address,
        bhk,
        price,
        bedrooms,
        bathroom,
        images,
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
    // return res.status(500).json({
    //   message:"Something bad happened"
    // })
  }
}

module.exports = listProperty;