//Importing  libraries
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const UAParser = require("ua-parser-js");


//Importing in-built files
const connectDB = require("./db/db");
connectDB();

const authRoute = require('./routes/auth.routes')

//In-Built Middleware
app.use(cookieParser())
app.use(express.json());
app.use(cors());

//Manual Middleware
app.get("/", (req, res) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();
  console.log(result);
  console.log("BrowserName:",result.browser.name)
  console.log("BrowserVersion:",result.browser.version)
  console.log("OSName:",result.os.name)
  console.log("OsVersion:",result.os.version)
  res.send("Server is running......");
});

app.use('/auth/',authRoute)


//Starting the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running , http://localhost:${port}`);
});
