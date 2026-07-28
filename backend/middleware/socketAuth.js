const jwt = require("jsonwebtoken");
const cookie = require("cookie")
async function socketAuth(socket, next) {

  try {
      
      const cookies =  await cookie.parseCookie(socket.handshake.headers.cookie)
      const token = cookies.accessToken;

      if (!token) {
        console.log("error")
          return next(new Error("No token"));
      }

      const decoded = jwt.verify(
          token,
          process.env.ACCESS_JWT_SECRET_KEY
      );
      // console.log(decoded)
      
      if(decoded.brokerId){
        const newDecoded = {
        "userId" : decoded.brokerId,
        "role":decoded.role
        }
        socket.user = newDecoded;
        next();
        return 
        // In further controller we need userId not brokerId so that newDecode has userId as key for  brokerId
      }
      
      socket.user = decoded;

      next();

  } catch (err) {
    console.log(err)
      next(new Error("Unauthorized"));

  }

}

module.exports = socketAuth;