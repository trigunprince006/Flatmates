const brokerModel = require('../../models/broker.model')
const conversationModel = require('../../models/conversation.model');
const userModel = require('../../models/user.model');

async function incomingMessage(socket,data,users,io){
    console.log("Data is : ",data)

    const userId = socket.user.userId;

    const {receiverId,message,senderId} = data

    // console.log("ReceiverId:",receiverId) 
    //   console.log("users",users)


    const receiverSocket = users[receiverId];
    console.log(receiverSocket)

    if(!receiverSocket){
        return console.log("Receiver does't Exist!!")
    }

    const receiverSocketId = receiverSocket.socketId;
    console.log("receiverSocketId : ",receiverSocketId)
    
        io.to(receiverSocketId).emit("receive-message", {
         sender: data.senderId,
         message: data.message
        });
}
module.exports = incomingMessage;