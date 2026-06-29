const io = require("socket.io-client");
const jwt = require("jsonwebtoken");

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJicm9rZXJJZCI6IjZhMzQwODQwZGQxMDQ2MzkyNTM0Y2JhYiIsInJvbGUiOiJicm9rZXIiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzgyNDYyMjg1LCJleHAiOjE3ODM3NTgyODV9.7pZ5b38fWcc4FmQJvOaddeam6pvm7W7QZ5KaMl8XsUM";

const socket = io("http://localhost:5000", {
  auth: {
    token: TOKEN,
  },
});

// const decoded = jwt.verify(TOKEN,process.env.ACCESS_JWT_SECRET_KEY)
// const senderId = decoded.userId;
// console.log("senderId",senderId)

socket.on("connect", () => {
  socket.emit("register", {
    username: "Chirag Kapoor",
  });

  console.log("connected to server!");
  console.log("Its Chirag Kapoor");

  socket.emit("private-message", {
    receiverId: "Adi Kumar",
    message: "Kaha bade adi?",
    senderId: "Chirag Kapoor",
  });
});

socket.on("receive-message", (data) => {
  console.log(`${data.sender}: ${data.message}`);
});
