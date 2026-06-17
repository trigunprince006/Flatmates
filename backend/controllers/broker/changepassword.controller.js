const brokerModel = require("../../models/broker.model");
const bcrypt = require("bcrypt");

async function changePassword(req, res) {
  try {
    console.log(req.body);
    const { oldPassword, newPassword } = req.body;
    if ( !oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Please , fill all the credentials",
      });
    }
    const brokerId = req.user.brokerId;
    const isBroker = await brokerModel.findById(brokerId);
    if (!isBroker) {
      return res.status(400).json({
        message: "Broker does't exit",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const isMatch = await bcrypt.compare(oldPassword, isBroker.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Password is Incorrect",
      });
    }
    if(oldPassword== newPassword){
      return res.status(400).json({
        message:"Password is same as previous"
      })
    }

    isBroker.password = hashedPassword;
    await isBroker.save();
    return res.status(200).json({
      message:"Password is changed successfully"
    })

  } catch (error) {
    console.log(error);
  }
}
module.exports = changePassword;
