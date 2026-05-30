const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

async function sendOtp(genratedOtp,phoneNumber) {
  console.log(phoneNumber)

  await client.messages.create({
    body: `Your One-Time-Password is ${genratedOtp}`,
    from: process.env.TWILIO_PHONE_NUMBER, // twillio provided numberr your
    to: "+91"+phoneNumber // From a registred Twilio number
  })
}

module.exports = sendOtp;
