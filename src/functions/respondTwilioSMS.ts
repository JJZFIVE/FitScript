const MessagingResponse = require("twilio").twiml.MessagingResponse;

async function respondTwilioSMS_(res: any, message: any) {
  const twiml = new MessagingResponse();
  twiml.message(message);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
}

module.exports = respondTwilioSMS_;

export {};
