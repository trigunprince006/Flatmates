const brokerModel = require("../../models/broker.model");
const tempUserModel = require("../../models/otp.Model");
const jwt = require("jsonwebtoken");

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  // console.log("RefreshToken is:",refreshToken)
  if (!refreshToken) {
    return res.status(400).json({
      message: "Please login first , for generating new token",
    });
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET_KEY);
  const brokerId = decoded.brokerId
  const isBroker = await brokerModel.findOne({brokerId});
  console.log("isBroker:",isBroker)
  if (!isBroker) {
    return res.status(400).json({
      message: "Invalid refresh Token",
    });
  }
  if (isBroker.refreshToken !== refreshToken) {
  return res.status(401).json({
    message: "Invalid refresh token",
  });
}
  if (decoded && isBroker) {
    const accessToken = jwt.sign(
      {
        brokerId: isBroker._id,
        type: "access",
      },
      process.env.ACCESS_JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({
      message:"Access token created successfully"
    })
  }
}

module.exports = refreshToken;