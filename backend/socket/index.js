const  {Server} = require('socket.io')
const chatListener = require('../socket/chatOn')
const socketAuth = require("../middleware/socketAuth")

function startSocketServer(server){
//Create a io instance for handling connection
  // let connectedClients=0;
  const io = new Server(server);
  let users = {};
  io.use(socketAuth);
  
  io.on("connection",(socket)=>{
    // connectedClients=connectedClients+1;
      console.log(`connected client with id ${socket.id}`)
    //If someone is connected then 1>listen them 2>send response
    chatListener(socket,users,io)
  })
}
module.exports = startSocketServer;

