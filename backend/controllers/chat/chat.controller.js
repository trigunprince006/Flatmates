const brokerModel = require("../../models/broker.model");
const conversationModel = require("../../models/conversation.model");
const userModel = require("../../models/user.model");
const getOnlineUsers = require("../../socket/saveClient");

async function incomingMessage(socket, data, users, io) {
  console.log(data);
  const userId = socket.user.userId; //Online user it may be act as sender or receiver.

  const onlineUsers = await getOnlineUsers(socket, users);
  const { receiverId, message, propertyId } = data;

  const isConversationExist = await conversationModel.findOne({
    senderId: userId,
  });
  // console.log(isConversationExist);
  if (isConversationExist) {
    isConversationExist.messages.push(message);
    await isConversationExist.save();
    const receiverSocket = onlineUsers[receiverId];
    console.log(receiverSocket);

    if (!receiverSocket) {
      return console.log("Receiver is not online");
    }

    const receiverSocketId = receiverSocket.socketId;
    console.log("receiverSocketId : ", receiverSocketId);

    io.to(receiverSocketId).emit("receive-message", {
      sender: data.userId,
      message: data.message,
    });
    return;
  }

  await conversationModel.create({
    senderId: userId,
    receiverId,
    propertyId,
    messages: message,
  });
  const receiverSocket = onlineUsers[receiverId];
  console.log(receiverSocket);

  if (!receiverSocket) {
    return console.log("Receiver is not online");
  }

  const receiverSocketId = receiverSocket.socketId;
  console.log("receiverSocketId : ", receiverSocketId);

  io.to(receiverSocketId).emit("receive-message", {
    sender: data.userId,
    message: data.message,
  });
}
module.exports = incomingMessage;
