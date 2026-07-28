let brokerId = null;
const urlParams = new URLSearchParams(window.location.search);

brokerId = urlParams.get('brokerId');

console.log("ReceiverId : ",brokerId)

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

async function brokerDetails(){
  const res = await fetch(`http://localhost:4000/broker/broker-details/id?id=${brokerId}`)

  const data = await res.json();
  // console.log(data);
  document.getElementById("brokerName").innerText =data.broker.fullname;
  document.getElementById("brokerName").style.textTransform = "capitalize";
  
  document.getElementById("profileImage").src = data.broker.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKJnygMP2haczLT0OB9W-2G43Ta-wK6AbWTfw2sChr7w&s=10";

}
brokerDetails();

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




document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("message");

  const message = input.value.trim();
  console.log("my Text : ", message)
  if (!message) return;

  addMyMessage(message);

  socket.emit("private-message", {
    receiverId: brokerId,
    message: message,
  });

  input.value = "";
});
