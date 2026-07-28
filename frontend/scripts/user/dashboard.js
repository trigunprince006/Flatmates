async function logout() {
  const response = await fetch("http://localhost:4000/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  const result = await response.json();

  console.log(result);
  alert(result.message);
  window.location.href = "../index.html";
}

function searchRoom() {
  alert("Go to Search Room Page");
}

function postProperty() {
  alert("Go to Post Property Page");
}

function myListings() {
  alert("Go to My Listings Page");
}

async function loadProfile() {
  const response = await fetch("http://localhost:4000/api/profile", {
    credentials: "include",
  });

  const data = await response.json();

  if (data.success === false) {
    const response = await fetch("http://localhost:4000/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });
  }

  document.getElementById("username").innerHTML = data.user.fullname;
  // console.log(data);
  document.getElementById("image").src = data.user.userProfile.profilePhoto;
}
loadProfile();
const API_URL = "http://localhost:4000/properties/property";
let currentPage = 1;

let limit = 10;

async function fetchProperty(page = 1) {
  const loading = document.getElementById("loading");
  const container = document.getElementById("propertyContainer");

  try {
    const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    const res = await response.json();

    console.log(res);

    const properties = res.Property;

    loading.style.display = "none";

    container.innerHTML = "";

    properties.forEach((property) => {
      const card = document.createElement("div");
      card.className = "card";

      let imageHTML = "";

      if (property.images && property.images.length > 0) {
        imageHTML = `
                    <img class="image"
                    src="${property.images[0]}"
                    alt="Property Image">
                `;
      } else {
        imageHTML = `
                    <div class="no-image">
                        No Image Available
                    </div>
                `;
      }

      card.innerHTML = `

                ${imageHTML}

                <div class="content">

                    <div class="address">
                        📍 ${property.address}
                    </div>

                    <div class="price">
                        ₹${property.price}/month
                    </div>

                    <div class="info">

                        <div class="item">
                            <h4>Type</h4>
                            <p>${property.type}</p>
                        </div>

                        <div class="item">
                            <h4>BHK</h4>
                            <p>${property.bhk}</p>
                        </div>

                        <div class="item">
                            <h4>Bedrooms</h4>
                            <p>${property.bedrooms}</p>
                        </div>

                        <div class="item">
                            <h4>Bathrooms</h4>
                            <p>${property.bathroom}</p>
                        </div>

                        <div class="item">
                            <h4>Furnishing</h4>
                            <p>${property.furnishingStatus}</p>
                        </div>

                        <div class="item" id ="brokerDetails">
                            <h4>Listed By</h4>
                            <p>${property.brokerName}</p>
                        </div>

                    </div>

                    <div class="status ${property.status}">
                        ${property.status.toUpperCase()}
                    </div>

                </div>

            `;

      container.appendChild(card);

      card.onclick = () => {
        window.location.href = `property-details.html?id=${property._id}`;
      };
    });
    createPagination(res.pagination);
  } catch (error) {
    loading.innerHTML = `
            <span style="color:red;">
                ${error.message}
            </span>
        `;
  }
}

function createPagination(data) {
  const pagination = document.getElementById("pagination");

  pagination.innerHTML = "";

  const { currentPage, totalRequiredPage } = data;
  // console.log(data)
  // Previous Button
  const prev = document.createElement("button");
  prev.innerText = "Previous";
  prev.disabled = currentPage === 1;

  prev.onclick = () => {
    fetchProperty(currentPage - 1);
  };

  pagination.appendChild(prev);

  // Page Numbers
  for (let i = 1; i <= totalRequiredPage; i++) {
    const btn = document.createElement("button");

    btn.innerText = i;

    if (i == currentPage) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      fetchProperty(i);
    };

    pagination.appendChild(btn);
  }

  // Next Button
  const next = document.createElement("button");
  next.innerText = "Next";
  next.disabled = currentPage === totalRequiredPage;

  next.onclick = () => {
    fetchProperty(currentPage + 1);
  };

  pagination.appendChild(next);
}
fetchProperty(currentPage);
