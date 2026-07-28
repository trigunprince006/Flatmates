const PROFILE_API = "http://localhost:4000/api/profile";
const reGenerateAccessTokenApi = "http://localhost:4000/auth/refresh-token";
const CHANGE_PASSWORD_API = "http://localhost:4000/api/change-password";

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

    const user = data.user || data;

    document.getElementById("fullname").innerText = user.fullname || "-";
    document.getElementById("occupation").innerText = user.occupation || "-";
    document.getElementById("relationship").innerText =
      user.userProfile.relationshipStatus || "-";
    document.getElementById("email").innerText = user.email || "-";
    document.getElementById("contact").innerText = user.phoneNumber || "-";

    if (user.userProfile.profilePhoto) {
      document.getElementById("profileImage").src =
        user.userProfile.profilePhoto;
      // console.log(document.getElementById("profileImage"))
    }
  } catch (err) {
    console.log(err);
    alert("Unable to fetch profile");
  }
}

loadProfile();
