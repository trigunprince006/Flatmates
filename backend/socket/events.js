const messageController = require("../controllers/chat/chat.controller");
const saveClient = require("./saveClient");

async function eventHandler(socket, users, io) {
  socket.on("private-message", async (data) => {
    console.log(`Private-message event is just fired`)
    await messageController(socket, data, users, io);
  });
}

module.exports = eventHandler;
