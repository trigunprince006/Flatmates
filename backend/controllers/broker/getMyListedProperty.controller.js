const propertyModel = require("../../models/property.model");

async function myListedProperty(req, res) {
  try {
    const brokerId = req.user.brokerId;

    const properties = await propertyModel.find({ listedBy: brokerId });

    if (!properties) {
      return res.status(400).json({
        success: false,
        message: "Not yet listed property here",
      });
    }

    return res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error!!",
    });
  }
}

module.exports = myListedProperty
