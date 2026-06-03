const userModel = require("../../models/user.model");
const tempUserModel = require("../../models/temp.user.model");
const randomize = require("randomatic");
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function sendOtpForLogin(req, res) {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({
      message: "Please enter phone number",
    });
  }
  const isUserExist = await userModel.findOne({ phoneNumber });
  if (isUserExist) {
    if (isUserExist.howManyTimesOtpGenerated >= 5) {
      const waitUntil = isUserExist.waitingForNextOtp;

      if (waitUntil && waitUntil < new Date()) {
        isUserExist.howManyTimesOtpGenerated = 0;
        isUserExist.waitingForNextOtp = null;
        await isUserExist.save();
      } else {
        if (!waitUntil) {
          isUserExist.waitingForNextOtp = new Date(Date.now() + 5 * 60 * 1000);
          await isUserExist.save();
        }
        return res.status(429).json({
          message: "OTP limit reached. Please try again after 5 minutes.",
        });
      }
    }
    const generatedOtp = randomize("0", 4);
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);

    isUserExist.otp = hashedOtp;
    isUserExist.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    isUserExist.howManyTimesOtpGenerated += 1;
    await isUserExist.save();
    await sendOtp(generatedOtp, phoneNumber);

    return res.status(200).json({
      message: "Otp send to your phone number",
    });
  }

  return res.status(400).json({
    message:
      "User not registered with this phone number,Please register yourself first",
  });
}

module.exports = sendOtpForLogin;