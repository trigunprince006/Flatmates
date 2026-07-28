const loginMessage = document.getElementById("loginMessage");
const resetMessage = document.getElementById("resetMessage");

const forgotModal = document.getElementById("forgotModal");

document.getElementById("forgotPasswordBtn").onclick = () => {
  forgotModal.style.display = "flex";
};

document.getElementById("closeModal").onclick = () => {
  forgotModal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target == forgotModal) {
    forgotModal.style.display = "none";
  }
};

// LOGIN

document.getElementById("loginBtn").onclick = async () => {
  const btn = document.getElementById("loginBtn");

  btn.disabled = true;
  btn.innerText = "Logging In...";

  loginMessage.innerHTML = "";

  const phoneNumber = document.getElementById("loginPhone").value.trim();

  const password = document.getElementById("loginPassword").value.trim();

  try {
    const response = await fetch("http://localhost:4000/broker/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        phoneNumber: Number(phoneNumber),
        password,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      loginMessage.className = "message success";
      loginMessage.innerHTML = "Login Successful";

      console.log(data);

      window.location.href = "dashboard.html";
    } else {
      loginMessage.className = "message error";
      loginMessage.innerHTML = data.message || "Login Failed";
    }
  } catch (err) {
    loginMessage.className = "message error";
    loginMessage.innerHTML = "Server Error";
  }

  btn.disabled = false;
  btn.innerText = "Login";
};

// SEND OTP

document.getElementById("sendOtpBtn").onclick = async () => {
  const btn = document.getElementById("sendOtpBtn");

  btn.disabled = true;

  btn.innerText = "Sending...";

  resetMessage.innerHTML = "";

  const phoneNumber = document.getElementById("resetPhone").value.trim();

  try {
    const response = await fetch(
      "http://localhost:4000/broker/send-otp-reset-password",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          phoneNumber: Number(phoneNumber),
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      resetMessage.className = "message success";
      resetMessage.innerHTML = "OTP Sent Successfully";
    } else {
      resetMessage.className = "message error";
      resetMessage.innerHTML = data.message || "Unable to Send OTP";
    }
  } catch (err) {
    resetMessage.className = "message error";
    resetMessage.innerHTML = "Server Error";
  }

  btn.disabled = false;
  btn.innerText = "Generate OTP";
};

// RESET PASSWORD

document.getElementById("resetBtn").onclick = async () => {
  const btn = document.getElementById("resetBtn");

  btn.disabled = true;

  btn.innerText = "Resetting...";

  resetMessage.innerHTML = "";

  const phoneNumber = document.getElementById("resetPhone").value.trim();

  const otp = document.getElementById("otp").value.trim();

  const newPassword = document.getElementById("newPassword").value.trim();

  try {
    const response = await fetch(
      "http://localhost:4000/broker/reset-password",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          phoneNumber: Number(phoneNumber),

          otp,

          newPassword,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      resetMessage.className = "message success";
      resetMessage.innerHTML = "Password Reset Successfully";
    } else {
      resetMessage.className = "message error";
      resetMessage.innerHTML = data.message || "Reset Failed";
    }
  } catch (err) {
    resetMessage.className = "message error";
    resetMessage.innerHTML = "Server Error";
  }

  btn.disabled = false;
  btn.innerText = "Reset Password";
};
