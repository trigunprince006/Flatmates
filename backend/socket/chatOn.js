const incomingMessageController = require('../controllers/chat/chat.controller');
const saveClient = require('../socket/saveClient')
async function handleMessage(socket,users,io) {
  

  socket.on("register",async (data)=>{
    await saveClient(socket,data,users)
  })
  socket.on("private-message",async (data)=>{
    await incomingMessageController(socket,data,users,io)
  })

}

module.exports = handleMessage;