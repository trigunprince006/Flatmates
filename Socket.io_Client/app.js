const io = require('socket.io-client');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTM0MjMxN2M5NWE5MDZhMjI0MDIzMTAiLCJyb2xlIjoidXNlciIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3ODI0NTQzODIsImV4cCI6MTc4Mzc1MDM4Mn0.dH4lDePfDElMKtG3Gm4xXU_xookRy_nk2aHsn_ohBmA"

const socket = io("http://localhost:5000", {
    auth: {
        token:TOKEN
    }
});
socket.on("connect",()=>{

   socket.emit("register",{
   "username":"Adi Kumar"
  })

  console.log("connected to server!")
  console.log("Its Adi  Kumar")

   socket.emit("private-message", {
    receiverId: "Chirag Kapoor",
    message: "Bol le ?",
    senderId: "Adi Kumar",
  });


});


socket.on("receive-message",(data)=>{
  // console.log(data)
  console.log(`${data.sender}: ${data.message}`)
})

socket.on("comingMessage",(data)=>{
  console.log("Server Response :",data)
})