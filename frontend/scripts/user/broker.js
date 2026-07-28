const brokerId = new URLSearchParams(window.location.search).get("id");

async function loadBroker() {
  try {
    const response = await fetch(
      `http://localhost:4000/broker/broker-details/id/?id=${brokerId}`,
    );

    if (!response.ok) {
      throw new Error("Broker not found");
    }

    const res = await response.json();
    const { broker } = res;
    document.getElementById("photo").src =
      broker.profilePhoto ||
      "https://www.flaticon.com/free-icon/user_9131590https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqE3e9RIK09-ejpr7BwnvNb4TpTjmXHGgrTTNc00vdtA&s=10";

    document.getElementById("name").innerText = broker.fullname;

    document.getElementById("email").innerText = broker.email;

    document.getElementById("phone").innerText = broker.phoneNumber;

    document.getElementById("experience").innerText =
      broker.experience || "N/A";

    document.getElementById("agency").innerText = broker.agency || "N/A";

    document.getElementById("address").innerText = broker.address || "N/A";

    document.getElementById("about").innerText =
      broker.about || "No description available.";
  } catch (error) {
    document.body.innerHTML = `<h2>${error.message}</h2>`;
  }
}

loadBroker();
