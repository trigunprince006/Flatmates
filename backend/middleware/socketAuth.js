const jwt = require("jsonwebtoken");

async function socketAuth(socket, next) {

  try {
      // console.log("Middleware is working...")
      // console.log("Handshake:", socket.handshake);

    // console.log("Auth:", socket.handshake.auth);

    // console.log("Token:", socket.handshake.auth.token);
      const token = socket.handshake.auth.token;

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
        // console.log("decoded.brokerId is satisfied ")
        const newDecoded = {
        "userId" : decoded.brokerId,
        "role":decoded.role
        }
        socket.user = newDecoded;
        next();
        return 
        // ye code isliye hai kyuki hmrara agar broker token bhejta hai to uske jab jwt.verify krenege to brokerId milega na ki userId so ye us brokerId ko userId me convert krega 
      }
      
      socket.user = decoded;

      next();

  } catch (err) {
    console.log(err)
      next(new Error("Unauthorized"));

  }

}

module.exports = socketAuth;