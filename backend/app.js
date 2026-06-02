//Importing  libraries
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');

//Importing in-built files
const connectDB = require("./db/db");
connectDB();

const userRoute = require('./routes/user.route')
const userAuthRoute = require('./routes/user.auth.route')
const refreshTokenAuthRoute = require('./routes/refresh.auth.route');
const { refreshToken } = require("./controllers/user.controller");
//In-Built Middleware
app.use(cookieParser())
app.use(express.json());
app.use(cors());

//Manual Middleware
app.get("/", (req, res) => {
  res.send("Server is running......");
});

app.use('/user/',userRoute)
app.use('/auth/',userAuthRoute)
app.use('/user/auth/',refreshTokenAuthRoute)


//Starting the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running , http://localhost:${port}`);
});
