require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function sendTwilioSMS(to: string, message: string): Promise<boolean> {
  try {
    await client.messages.create({
      body: message,
      from: "+13024837626",
      to: to,
    });

    console.log("MESSAGE SENT TO" + to);

    return true;
  } catch (error) {
    console.log("MESSAGE NOT SENT", error.message);
    return false;
  }
}

module.exports = sendTwilioSMS;

export {};
