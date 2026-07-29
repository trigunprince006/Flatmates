const propertyId = new URLSearchParams(window.location.search).get("propertyId");

async function loadProperty() {
  try {
    const response = await fetch(
      `http://localhost:4000/properties/house/id/?id=${propertyId}`,
    );

    if (!response.ok) {
      throw new Error("Property not found");
    }

    const res = await response.json();
    const { property } = res;
    console.log(property);

    document.getElementById("image").src =
      property.images.length > 0
        ? property.images[0]
        : "https://via.placeholder.com/800x400?text=No+Image";

    document.getElementById("address").innerText = property.address;

    document.getElementById("price").innerText = `₹${property.price}/month`;

    document.getElementById("description").innerText =
      property.description || "No Description";

    document.getElementById("type").innerText = property.type;

    document.getElementById("bhk").innerText = property.bhk;

    document.getElementById("bedrooms").innerText = property.bedrooms;

    document.getElementById("bathroom").innerText = property.bathroom;

    document.getElementById("furnishing").innerText = property.furnishingStatus;

    document.getElementById("broker").innerText = property.brokerName;

    document.getElementById("status").innerText = property.status;
    const messageBox = document.getElementById("messageBox");

    messageBox.onclick = () => {
      window.location.href = `message.html?propertyId=${propertyId}&brokerId=${property.listedBy}`;
    };
  } catch (error) {
    document.body.innerHTML = `<h2>${error.message}</h2>`;
  }
}

loadProperty();
