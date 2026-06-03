const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

async function sendOtp(generatedOtp,phoneNumber) {


  await client.messages.create({
    body: `Your One-Time-Password is ${generatedOtp}`,
    from: process.env.TWILIO_PHONE_NUMBER, // twilio provided number your
    to: "+91"+phoneNumber // From a registered Twilio number
  })
}

module.exports = sendOtp;
