const API = {
  generateOTP: "http://localhost:4000/auth/generate-otp",

  verifyOTP: "http://localhost:4000/auth/verify-otp",

  register: "http://localhost:4000/auth/register",
};

let otpVerified = false;

const message = document.getElementById("message");

function showMessage(text, type = "success") {
  const message = document.getElementById("message");

  message.textContent = text;
  message.className = `message ${type}`;
  message.style.display = "block";

  clearTimeout(message.timer);

  message.timer = setTimeout(() => {
    message.style.display = "none";
  }, 5000);
}
function setLoading(btn, state) {
  if (state) {
    btn.classList.add("loading");
    btn.innerHTML = "Please Wait...";
  } else {
    btn.classList.remove("loading");
  }
}

document.getElementById("generateBtn").onclick = async () => {
  const fullname = document.getElementById("fullname").value.trim();

  const email = document.getElementById("email").value.trim();

  const phoneNumber = document.getElementById("phone").value.trim();

  if (!fullname || !email || !phoneNumber) {
    showMessage("Fill all fields", "error");

    return;
  }

  const btn = document.getElementById("generateBtn");

  setLoading(btn, true);

  try {
    const response = await fetch(API.generateOTP, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        fullname,

        email,

        phoneNumber,
      }),
    });

    const data = await response.json();
    console.log(data);
    showMessage(data.message || "OTP Sent Successfully", "success");

    document.getElementById("otpSection").style.display = "block";

    btn.innerHTML = "Resend OTP";

    setLoading(btn, false);
  } catch (e) {
    showMessage("Failed to Generate OTP", "error");

    btn.innerHTML = "Generate OTP";

    setLoading(btn, false);
  }
};

document.getElementById("verifyBtn").onclick = async () => {
  const phoneNumber = document.getElementById("phone").value;

  const otp = document.getElementById("otp").value.toString();

  if (!otp) {
    showMessage("Enter OTP", "error");

    return;
  }

  const btn = document.getElementById("verifyBtn");

  setLoading(btn, true);

  try {
    const response = await fetch(API.verifyOTP, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        phoneNumber,
        otp,
      }),
    });

    const data = await response.json();
    console.log(data);
    // console.log(document.getElementById("registerBtn").disabled);
    if (data.message) {
      otpVerified = true;
      if (otpVerified) {
        btn.disabled = true;
      }
      document.getElementById("registerBtn").disabled = false;
      console.log(document.getElementById("registerBtn").disabled);

      showMessage("OTP Verified Successfully", "success");
    } else {
      showMessage(data.message, "error");
    }

    btn.innerHTML = "Verify OTP";

    setLoading(btn, false);
  } catch (e) {
    showMessage("OTP Verification Failed", "error");

    btn.innerHTML = "Verify OTP";

    setLoading(btn, false);
  }
};

document.getElementById("registerBtn").onclick = async () => {
  console.log("Register btn is working");
  if (!otpVerified) {
    showMessage("Verify OTP First", "error");

    return;
  }

  const fullname = document.getElementById("fullname").value;

  const email = document.getElementById("email").value;

  const phoneNumber = document.getElementById("phone").value;

  const btn = document.getElementById("registerBtn");

  setLoading(btn, true);

  try {
    const response = await fetch(API.register, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        fullname,

        email,

        phoneNumber,
      }),
    });

    const data = await response.json();
    console.log(data);
    showMessage(data.message || "Registration Successful", "success");

    // btn.innerHTML = "Registered";
    window.location.href = "login.html";
  } catch (e) {
    showMessage("Registration Failed", "error");

    btn.innerHTML = "Register";

    setLoading(btn, false);
  }
};
