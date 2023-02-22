/* 

OLD, WAS DOING TESTING TO VERIFY THIS NUMBER ON ICLOUD FOR BLUE TEXTING BUT IT DIDN'T WORK

*/

require("dotenv").config();
const twilioClient = require("twilio");

import type { Request, Response } from "express";

// Twilio config
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const WEBHOOKURL = process.env.WEBHOOKURL; // This is the URL that Twilio will send the webhook to

enum TextClassifications {
  Fitness = 0,
  Dashboard = 1,
  Premium = 2,
}

const verifyiCloud = async (req: Request, res: Response) => {
  try {
    // Check if this is actually from Twilio, prevents hackers from sending requests to our webhook
    const twilioSignature = req.headers["x-twilio-signature"];
    const body = req.body;
    const isValid = twilioClient.validateRequest(
      TWILIO_AUTH_TOKEN,
      twilioSignature,
      WEBHOOKURL,
      body
    );

    // if (!isValid) {
    //   return res.status(403).send("Invalid request, not from Twilio");
    // }

    const message = body.Body.trim();

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

module.exports = verifyiCloud;
export {};
