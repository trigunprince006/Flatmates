const API = "http://localhost:4000";

const conversationList = document.getElementById("conversationList");
const propertyInfo = document.getElementById("propertyInfo");
const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let conversations = [];
let selectedConversation = null;

window.addEventListener("DOMContentLoaded", loadConversations);

async function loadConversations() {
  try {
    const res = await fetch(`${API}/broker/all-messages`, {
      credentials: "include",
    });

    const data = await res.json();

    console.log(data);

    if (!data.success) return;

    conversations = data.conversations;

    renderConversationList();

    if (conversations.length > 0) {
      openConversation(conversations[0]._id);
    }
  } catch (err) {
    console.error(err);
  }
}

function renderConversationList() {
  conversationList.innerHTML = "";

  conversations.forEach((conversation) => {
    const property = conversation.propertyDetails;
    const sender = conversation.senderDetails;

    const card = document.createElement("div");

    card.className = "conversation";

    card.innerHTML = `

            <img
                class="property-image"
                src="${property.images?.[0] || "https://placehold.co/90x90"}"
                alt="Property"
            >

            <div class="conversation-details">

                <h4>${property.bhk} BHK at ${property.address}</h4>

                <p class="last-message">
                    ${conversation.messages.at(-1) || ""}
                </p>

            </div>

        `;

    card.addEventListener("click", () => {
      openConversation(conversation._id);
    });

    conversationList.appendChild(card);
  });
}

function openConversation(id) {
  selectedConversation = conversations.find(
    (conversation) => conversation._id === id,
  );

  document
    .querySelectorAll(".conversation")
    .forEach((card) => card.classList.remove("active"));

  const index = conversations.findIndex(
    (conversation) => conversation._id === id,
  );

  if (index >= 0) {
    document.querySelectorAll(".conversation")[index].classList.add("active");
  }

  renderProperty();

  renderMessages();
}

function renderProperty() {
  const property = selectedConversation.propertyDetails;
  const sender = selectedConversation.senderDetails;

  propertyInfo.innerHTML = `
  <div class="header-user">

    <img src="${sender.profilePic}"class="header-user-pic">
      <span id = "header-name">${sender.fullname}</span>

  </div>

    `;
}

function renderMessages() {
  messages.innerHTML = "";

  selectedConversation.messages.forEach((message, index) => {
    const bubble = document.createElement("div");

    // Temporary until backend returns sender info
    bubble.className = index ? "left-msg" : "right-msg";

    bubble.textContent = message;

    messages.appendChild(bubble);
  });

  messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  if (!selectedConversation) return;

  const text = messageInput.value.trim();

  if (!text) return;

  // Temporary UI update
  selectedConversation.messages.push(text);

  renderMessages();

  messageInput.value = "";

  /*
    await fetch(`${API}/broker/send-message`, {

        method: "POST",

        credentials: "include",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            conversationId: selectedConversation._id,
            message: text

        })

    });
    */
}
