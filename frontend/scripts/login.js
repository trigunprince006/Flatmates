const BASE_URL = "http://localhost:4000/auth";

let timer = 30;
let interval;

function showMessage(msg, type) {
  const m = document.getElementById("message");

  m.innerHTML = msg;

  m.className = type;
}

async function sendOTP() {
  const phone = document.getElementById("phone").value.trim();

  if (phone.length !== 10) {
    showMessage("Enter a valid phone number.", "error");

    return;
  }

  const btn = document.getElementById("sendBtn");
  const resend = document.getElementById("resendBtn");

  btn.disabled = true;
  btn.innerHTML = "Sending...";

  try {
    const response = await fetch(`${BASE_URL}/send-otp`, {
      method: "POST",
      // credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        phoneNumber: phone,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      showMessage("OTP sent successfully.", "success");
      btn.style.display = "none";
      document.getElementById("otpSection").style.display = "block";

      startTimer();
    } else {
      showMessage(data.message || "Failed to send OTP", "error");
    }
  } catch (err) {
    showMessage("Server Error", "error");
  }

  btn.disabled = false;
  btn.innerHTML = "Send OTP";
}

function startTimer() {
  timer = 30;

  const resend = document.getElementById("resendBtn");

  resend.disabled = true;

  document.getElementById("countdown").innerHTML = timer;

  clearInterval(interval);

  interval = setInterval(() => {
    timer--;

    document.getElementById("countdown").innerHTML = timer;

    if (timer <= 0) {
      clearInterval(interval);

      resend.disabled = false;

      document.querySelector(".timer").innerHTML = "You can resend OTP now.";
    }
  }, 1000);
}

async function loginUser() {
  const phone = document.getElementById("phone").value.trim();

  const otp = document.getElementById("otp").value.trim();

  if (otp.length !== 4) {
    showMessage("Enter valid OTP.", "error");

    return;
  }

  const btn = document.getElementById("loginBtn");

  btn.disabled = true;
  btn.innerHTML = "Logging In...";

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      credentials: "include", // <-- ADD THIS
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        phoneNumber: phone,
        otp: otp,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      showMessage("Login Successful 🎉", "success");
      // Save token if returned

      // localStorage.setItem("token",data.token);

      // Redirect

      window.location.href = "./user/dashboard.html";
      console.log(data);
    } else {
      showMessage(data.message || "Invalid OTP", "error");
    }
  } catch (err) {
    showMessage("Server Error", "error");
  }

  btn.disabled = false;

  btn.innerHTML = "Login";
}
