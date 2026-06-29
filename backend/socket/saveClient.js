async function saveClient(socket,data,users) {
  
  const {username} = data
  const  userId = socket.user.userId;
  // console.log("UserId : ",userId)
  const socketId = socket.id;

  users[username]={
    socketId
  }
  console.log("users : ",users)
}
module.exports = saveClient;