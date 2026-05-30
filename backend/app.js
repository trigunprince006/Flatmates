//Importing  libraries
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

//Importing in-built files
const connectDB = require("./db/db");
connectDB();

const userRoute = require('./routes/user.route')
//In-Built Middleware
app.use(express.json());
app.use(cors());

//Manual Middleware
app.get("/", (req, res) => {
  res.send("Server is running......");
});

app.use('/user/',userRoute)

//Starting the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running , http://localhost:${port}`);
});
