const userModel = require("../../models/user.model");
const tempUserModel = require("../../models/temp.user.model");
const randomize = require("randomatic");
const sendOtp = require("../../services/sendOtp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({
      message: "Please login first",
    });
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET_KEY);
  const isUser = await userModel.findById(decoded.userId);
  if (!isUser) {
    return res.status(400).json({
      message: "Invalid refresh Token",
    });
  }
  if (isUser.refreshToken !== refreshToken) {
  return res.status(401).json({
    message: "Invalid refresh token",
  });
}
  if (decoded && isUser) {
    const accessToken = jwt.sign(
      {
        userId: isUser._id,
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