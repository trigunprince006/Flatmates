const propertyModel = require('../../models/property.model');

async function getAllProperty(req,res){
 try {
  const property =  await propertyModel.find({})
  console.log(property)
  return res.status(200).json({
    message : "All properties fetched successfully",
    Property : property
  })
 } catch (error) {
  console.log(error)
 }
}
module.exports = getAllProperty;