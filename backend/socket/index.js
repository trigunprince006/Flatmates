const { Server } = require("socket.io");
const eventHandler = require("../socket/events");
const saveClient =  require('../socket/saveClient')
const socketAuth = require("../middleware/socketAuth");

function startSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5500",
      credentials: true,
    },
  });
  let users = {};
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`A  client is connected with id ${socket.id}`);
    saveClient(socket,users)
    eventHandler(socket, users, io);
  });
}
module.exports = startSocketServer;
