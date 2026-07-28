const socket = io("http://localhost:4000", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});

socket.on("connect_error", (err) => {
  console.log(err.message);
});

const chatBox = document.getElementById("chatBox");

function addMyMessage(message) {
  chatBox.innerHTML += `
        <div style="text-align:right;margin:10px 0;">
            <span style="
                background:#007bff;
                color:white;
                padding:10px 15px;
                border-radius:10px;
                display:inline-block;
                max-width:70%;
            ">
                ${message}
            </span>
        </div>
    `;

  chatBox.scrollTop = chatBox.scrollHeight;
}

function addBrokerMessage(message) {
  chatBox.innerHTML += `
        <div style="text-align:left;margin:10px 0;">
            <span style="
                background:#e4e6eb;
                color:black;
                padding:10px 15px;
                border-radius:10px;
                display:inline-block;
                max-width:70%;
            ">
                ${message}
            </span>
        </div>
    `;

  chatBox.scrollTop = chatBox.scrollHeight;
}
document.getElementById("sendBtn").onclick = () => {
  const input = document.getElementById("message");

  const message = input.value.trim();

  if (!message) return;

  addMyMessage(message);

  socket.emit("private-message", {
    receiverId: brokerId,
    message: message,
  });

  input.value = "";
};
