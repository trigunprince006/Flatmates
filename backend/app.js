//Importing  libraries
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const UAParser = require("ua-parser-js");
const helmet = require('helmet')

//Importing in-built files
const connectDB = require("./db/db");
connectDB();

const authRoute = require('./routes/auth.routes')

//In-Built Middleware
app.use(cookieParser())
app.use(express.json());
app.use(cors());
app.use(helmet());
//Manual Middleware
app.get("/", (req, res) => {
   const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    // Here u can use Destructuring for better look of code
    const browserName = result.browser.name;
    const browserVersion = result.browser.version;
  
    const OsName = result.os.name;
    const OsVersion = result.os.version;
  
    const deviceType = result.device.type ||'desktop';
    const deviceModel = result.device.model;
    const deviceCompany = result.device.vendor;
  
    const ipAddress = req.ip;
    const UA = req.headers["user-agent"];
    console.log(deviceCompany)
    console.log(deviceModel)
    console.log(deviceType)
    console.log(OsName)
    console.log(OsVersion)
    console.log(browserName)
    console.log(browserVersion)
    console.log(result)
  res.send("Server is running")

});

app.use('/auth/',authRoute)


//Starting the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running , http://${process.env.IP_ADDRESS_FOR_MOBILE}:${port}`);
});
