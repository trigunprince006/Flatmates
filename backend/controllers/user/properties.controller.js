const propertyModel = require('../../models/property.model');

async function getAllProperty(req,res){

 try {
  // console.log(req.query)
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  console.log("page -->",page)
  console.log("limit -->",limit)
  const skipData = (page-1)*10;//it basically skip the fist x number of document for page x because the data is coming from db is in array format so in page two u want to display a document start with 11 number but if u not set skip then it will show only 10 document that is start with 1 to 10 but in page two we have to display 10 to 20 that's why we set skipDoc in skip() .
  const totalProperties = await propertyModel.countDocuments();
  const property =  await propertyModel.find()
  .skip(skipData)//skip the starting number of data in db.
  .limit(limit)//Fetch limited number if documents
  .sort({ createdAt: -1 });//in descending order by created time

  const totalRequiredPage = Math.ceil(totalProperties/limit);

   if(totalRequiredPage<page){

    return res.status(200).json({
      success : true,
      message:"No further data is available~"
    })
   }


  return res.status(200).json({
    success:true,
    message : "All properties fetched successfully",
    Property : property,
    pagination:{
      currentPage : page,
      totalRequiredPage,
      totalProperties,
      limit
    }

  })

 }
  catch (error) {
  console.log(error)
 }
}
module.exports = getAllProperty;