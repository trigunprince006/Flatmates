const form = document.getElementById("propertyForm");
const message = document.getElementById("message");
const btn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  btn.disabled = true;
  btn.innerText = "Listing...";

  const formData = new FormData();

  formData.append("address", form.address.value);
  formData.append("bhk", form.bhk.value);
  formData.append("price", form.price.value);
  formData.append("bedrooms", form.bedrooms.value);
  formData.append("bathroom", form.bathroom.value);
  formData.append("furnishingStatus", form.furnishingStatus.value);
  formData.append("type", form.type.value);

  const files = form.images.files;

  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  try {
    const response = await fetch(
      "http://localhost:4000/properties/list-property",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );

    const data = await response.json();
    if (response.Unauthorized) {
      const response = await fetch(
        "http://localhost:4000/broker/refresh-token",
        {
          method: "POST",
          credentials: "include",
        },
      );
    }

    if (response.ok) {
      message.style.color = "green";
      message.innerText = "Property Listed Successfully.";

      form.reset();
      window.location.href = "my-listed-property.html";
    } else {
      message.style.color = "red";
      message.innerText = data.message || "Failed to list property.";
    }
  } catch (err) {
    message.style.color = "red";
    message.innerText = "Server Error.";
  }

  btn.disabled = false;
  btn.innerText = "List Property";
});
