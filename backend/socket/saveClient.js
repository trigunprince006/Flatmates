async function saveClient(socket,users) {
  
  const  userId = socket.user.userId;

  users[userId]={
    socketId : socket.id
  }
  console.log("Online users : ",users)
  return users;
}
module.exports = saveClient;