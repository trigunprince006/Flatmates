const PROFILE_API = "http://localhost:4000/broker/profile";
const reGenerateAccessTokenApi = "http://localhost:4000/broker/refresh-token";
const CHANGE_PASSWORD_API = "http://localhost:4000/broker/change-password";

async function loadProfile() {
  try {
    const res = await fetch(PROFILE_API, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);
    if (data.success === false) {
      const res = await fetch(reGenerateAccessTokenApi, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
    }
    // console.log(data);

    const broker = data.broker || data;

    document.getElementById("fullname").innerText = broker.fullname || "-";

    document.getElementById("email").innerText = broker.email || "-";
    document.getElementById("contact").innerText = broker.phoneNumber || "-";
  } catch (err) {
    console.log(err);
    alert("Unable to fetch profile");
  }
}

loadProfile();
