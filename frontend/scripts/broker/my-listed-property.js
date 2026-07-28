const container = document.getElementById("propertyContainer");

async function loadProperties() {
  container.innerHTML = "<h2>Loading...</h2>";

  try {
    const response = await fetch(
      "http://localhost:4000/broker/my-listed-property",
      {
        credentials: "include",
      },
    );

    const data = await response.json();

    console.log(data);

    container.innerHTML = "";

    // Change this if your API returns a different key.
    const properties = data.properties || data.data || [];

    if (properties.length === 0) {
      container.innerHTML = "<div class='message'>No Property Found</div>";
      return;
    }

    properties.forEach((property) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
                <img src="${property.images?.[0] || "https://placehold.co/600x400"}">

                <h3>${property.title || "No Title"}</h3>

                <p><b>City:</b> ${property.city || "-"}</p>

                <p><b>Price:</b> ₹${property.price || "-"}</p>

                <p><b>Status:</b> ${property.status || "Available"}</p>

                <div class="button-group">

                    <button class="view-btn" onclick="viewProperty('${property._id}')">
                        View
                    </button>

                    <button class="edit-btn" onclick="editProperty('${property._id}')">
                        Edit
                    </button>

                    <button class="delete-btn" onclick="deleteProperty('${property._id}')">
                        Delete
                    </button>

                </div>
            `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);

    container.innerHTML =
      "<div class='message'>Failed to load properties.</div>";
  }
}

function viewProperty(id) {
  window.location.href = `property-details.html?id=${id}`;
}

function editProperty(id) {
  alert("Edit Property : " + id);
}

function deleteProperty(id) {
  alert("Delete Property : " + id);
}

loadProperties();
