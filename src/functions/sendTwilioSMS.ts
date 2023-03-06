require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function sendTwilioSMS(to: string, message: string): Promise<boolean> {
  try {
    const phoneNumber =
      process.env.NODE_ENV == "dev" ? "+19849999370" : "+13024837626";

    await client.messages.create({
      body: message,
      from: phoneNumber,
      to: to,
    });

    return true;
  } catch (error) {
    console.log("MESSAGE NOT SENT", error.message);
    return false;
  }
}

module.exports = sendTwilioSMS;

export {};
