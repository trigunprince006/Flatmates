const otpModel = require("../../models/otp.Model");
const brokerModel = require("../../models/broker.model");
const bcrypt = require("bcrypt");

async function resetPassword(req, res) {
  try {
    console.log(req.body);
    const { phoneNumber, otp, newPassword } = req.body;

    
    if (!phoneNumber || !otp || !newPassword) {
      return res.status(400).json({
        message: "Please,fill all thr field",
      });
    }
    const isBrokerExist = await brokerModel.findOne({phoneNumber});
    if (!isBrokerExist) {
      return res.status(400).json({
        message: "broker not exist with this phone number",
      });
    }
    const isOtpExist = await otpModel.findOne({phoneNumber});
    if (!isOtpExist) {
      return res.status(400).json({
        message: "Please verify phoneNumber first",
      });
    }
    const existOtp = isOtpExist.otp;
    if (isOtpExist.otpExpiresAt < new Date()) {
      return res.status(400).json({
        message: "Otp is expired,generate new otp",
      });
    }
    const isMatch = await bcrypt.compare(otp, existOtp);
    if (!isMatch) {
      if (isOtpExist.attempt >= 3) {
        isOtpExist.otp = null;
        await isOtpExist.save();
        return res.status(429).json({
          message:
            "You Entered to many times incorrect otp , please generate new one",
        });
      }
      //Ye logic agar otp galat hoga toh kamn krega , par kya ho agar 3 se jyada bar galat ho jaye??
      isOtpExist.attempt + 1;
      await isOtpExist.save();
      return res.status(400).json({
        message: "OTP is Incorrect",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    isBrokerExist.password = hashedPassword;
    await isBrokerExist.save();
    await otpModel.findOneAndDelete({phoneNumber})
    return res.status(200).json({
      message: "Password is changed successfully",
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server Error",
    });
  }
}
module.exports = resetPassword;
