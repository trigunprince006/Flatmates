const brokerModel = require("../../models/broker.model");
const otpModel = require("../../models/otp.Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UAParser = require('ua-parser-js')
const sessionModel = require('../../models/session.model')

async function login(req, res) {
  // console.log("Login request",req.body)
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return res.status(400).json({
      message: "Please enter all credentials",
    });
  }
  const isBrokerExist = await brokerModel.findOne({ phoneNumber });
  // console.log("isBrokerExist",isBrokerExist)
  if (!isBrokerExist) {
    return res.status(400).json({
      message: "Broker does't exist,Please register yourself",
    });
  }
  const isMatch = await bcrypt.compare(password,isBrokerExist.password);
  console.log(isMatch)
  if(!isMatch){
//isme ek dikkat hai hme attmept block lgana padega wrna user jitni marji utni par try krte rahgea password dal dal ke
    return res.status(400).json({
      message: "Password is incorrect"
    });
  }
  const accessToken = await jwt.sign(
    {
      brokerId: isBrokerExist._id,
      role:"broker",
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

  const refreshToken = await jwt.sign(
    {
      brokerId: isBrokerExist._id,
      role:"user",
      type: "refresh",
    },
    process.env.REFRESH_JWT_SECRET_KEY,
    {
      expiresIn: "90d",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });

  // const parser = new UAParser(req.headers["user-agent"]);
  // const result = parser.getResult();
  // // Here u can use Destructuring for better look of code
  // const {name,version}=result.browser


  // const OsName = result.os.name;
  // const OsVersion = result.os.version;

  // const deviceType = result.device.type || 'Desktop';;
  // const deviceModel = result.device.model || 'null';
  // const deviceCompany = result.device.vendor || 'null';

  // const ipAddress = req.ip;
  // const UA = req.headers["user-agent"];
  // const brokerId  = isBrokerExist._id;
  // const session = await sessionModel.find({brokerId});/
  // console.log(session)
  /* Here we can implement a features on session management for better login handling for a user with multiple devices login but my mind is note yet able to process and design it so move forward and work on to next features of this project */ 
  // if(session){
  //   if(session.)
  // }

  // await sessionModel.create({
  //   userId: isBrokerExist._id,
  //   refreshToken: refreshToken,
  //   device: {
  //     deviceType,
  //     deviceModel,
  //     deviceCompany,
  //   },
  //   userAgent: UA,
  //   browser: {
  //     browserName:name,
  //     browserVersion:version,
  //   },
  //   Os: {
  //     OsName,
  //     OsVersion,
  //   },
  //   ipAddress: ipAddress,
  //   expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  // });
  isBrokerExist.refreshToken = refreshToken;
  await isBrokerExist.save();
  console.log(isBrokerExist.refreshToken)
  return res.status(200).json({
    message: "Logged in successfully",
  });
}

module.exports = login;
