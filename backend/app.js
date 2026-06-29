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
const brokerRoute = require('./routes/broker.route')
const propertyRoute = require('./routes/property.routes')
const chatRoute = require('./routes/chat.routes');
const startSocketServer = require("./socket");
const path = require('path');
app.use(express.static(path.join(__dirname, 'msgFrontend')));
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
app.use('/broker',brokerRoute)
app.use('/properties',propertyRoute)
// app.use('/chats',chatRoute)
//Starting the server
const port = process.env.PORT;
 const expressServer =  app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
  })

//creating a socket.io server 
startSocketServer(expressServer);

