const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    console.log("Middleware working....")
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_JWT_SECRET_KEY
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
}

module.exports = auth;