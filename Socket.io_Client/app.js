const io = require('socket.io-client')

const socket  = io("http://localhost:5000")

socket.emit("private-message",{
  "to":"Teliya",
  "message":"Ka badu dhaniya??"
})