const msg = document.getElementById("msg");

let otpVerified = false;

const phoneInput = document.getElementById("phone");

document.getElementById("sendOtpBtn").addEventListener("click", async () => {
  const phoneNumber = phoneInput.value;
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  try {
    const res = await fetch("http://localhost:4000/broker/send-otp", {
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

    const data = await res.json();

    console.log(data);

    msg.innerText = data.message || "OTP Sent";
  } catch (err) {
    console.error(err);
    msg.innerText = "Failed to send OTP";
  }
});

document.getElementById("verifyOtpBtn").addEventListener("click", async () => {
  const phoneNumber = phoneInput.value;

  const otp = document.getElementById("otp").value;

  try {
    const res = await fetch("http://localhost:4000/broker/verify-otp", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        phoneNumber,
        otp,
      }),
    });

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      otpVerified = true;

      msg.innerText = "OTP Verified Successfully";
    } else {
      otpVerified = false;

      msg.innerText = data.message || "OTP Verification Failed";
    }
  } catch (err) {
    console.error(err);

    msg.innerText = "Error verifying OTP";
  }
});

document.getElementById("registerBtn").addEventListener("click", async () => {
  if (!otpVerified) {
    alert("Please verify OTP first.");

    return;
  }

  const fullname = document.getElementById("fullname").value;

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const phoneNumber = Number(document.getElementById("phone").value);

  try {
    const res = await fetch("http://localhost:4000/broker/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        fullname,
        email,
        password,
        phoneNumber,

        brokerProfile: {},
      }),
    });

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      msg.innerText = "Broker Registered Successfully";
      window.location.href = "login.html";
    } else {
      msg.innerText = data.message || "Registration Failed";
    }
  } catch (err) {
    console.error(err);

    msg.innerText = "Server Error";
  }
});
