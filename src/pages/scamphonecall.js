// Twilio Outbound Call Script
// Usage: node src/pages/scamphonecall.js
//
// This script makes an outbound phone call using the Twilio API.
// When the recipient answers, they will hear a scam awareness message.

require("dotenv").config();
const twilio = require("twilio");

// Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const myPhoneNumber = process.env.MY_PHONE_NUMBER;

// Create Twilio client
const client = twilio(accountSid, authToken);

async function makeCall() {
  try {
    console.log("📞 Initiating outbound call...");
    console.log(`   From: ${twilioPhoneNumber}`);
    console.log(`   To:   ${myPhoneNumber}`);
    console.log("");

    // Build TwiML with a scam simulation dialogue
    const twiml = [
      '<Response>',
      '  <Say voice="Polly.Matthew-Generative">Hello, this is an urgent call from L H D N. Our records show you have an outstanding tax penalty of R M 30,000. If this is not settled immediately, an arrest warrant will be issued. However, we can offer a settlement discount if you clear the payment today.</Say>',
      '  <Pause length="1"/>',
      '  <Say voice="Polly.Joanna-Generative">Wait, how much do I need to pay? Please, I don\'t want to get arrested.</Say>',
      '  <Pause length="1"/>',
      '  <Say voice="Polly.Matthew-Generative">To close the case and avoid arrest, you just need to transfer the discounted amount, R M 5,000, to this phone number via TNG eWallet right now.</Say>',
      '  <Pause length="1"/>',
        '</Response>',
    ].join('');

    const call = await client.calls.create({
      twiml: twiml,
      to: myPhoneNumber, // Recipient phone number
      from: twilioPhoneNumber, // Your Twilio phone number
    });

    console.log("✅ Call initiated successfully!");
    console.log(`   Call SID: ${call.sid}`);
    console.log(`   Status:   ${call.status}`);
    console.log("");
    console.log("The recipient should receive the call shortly.");
  } catch (error) {
    console.error("❌ Failed to make call:");
    console.error(`   Error: ${error.message}`);

    if (error.code) {
      console.error(`   Code:  ${error.code}`);
    }
    if (error.moreInfo) {
      console.error(`   Info:  ${error.moreInfo}`);
    }

    process.exit(1);
  }
}

// Run the call
makeCall();
