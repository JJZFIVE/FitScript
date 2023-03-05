require("dotenv").config();
const pool = require("../db");
const twilioClient = require("twilio");
const { Configuration, OpenAIApi } = require("openai");

// Personal modules
const getFilterErrorMsg = require("../responses/fitnessfilter/filterErrorMsg");
const getNoUserMsg = require("../responses/signup/noUser");
const inviteUser = require("../responses/admin-commands/invite");
const respondTwilioSMS = require("../functions/respondTwilioSMS");
const getDashboardMsg = require("../responses/customer/dashboardMsg");
const getPremiumMsg = require("../responses/customer/premiumMsg");
const isAdmin = require("../functions/isAdmin");
const getRecentMessages = require("../functions/getRecentMessages");
const insertResAndReq = require("../functions/insertResAndReq");

const sendTwilioSms = require("../functions/sendTwilioSMS");
const getNewUserMsg = require("../responses/signup/newUser");

import type { Customer, RequestAndResponse } from "../types/db";
import type { Request, Response } from "express";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Twilio config
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const WEBHOOKURL = process.env.WEBHOOKURL; // This is the URL that Twilio will send the webhook to

enum TextClassifications {
  Fitness = 0,
  Dashboard = 1,
  Premium = 2,
}

const twilioWebhook = async (req: Request, res: Response) => {
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

    if (!isValid) {
      return res.status(403).send("Invalid request, not from Twilio");
    }

    const MESSAGE = body.Body.trim();
    const twilioFrom = body.From;

    /************************
      Checks if there's a user in the database with the phone number
      ************************/

    const sql = `SELECT * FROM CUSTOMER WHERE phone = $1`;
    const { rows } = await pool.query(sql, [twilioFrom]);
    let customer: Customer | undefined = rows[0];

    if (!customer) {
      respondTwilioSMS(res, getNoUserMsg());
      return;
    }

    console.log("INCOMING MESSAGE: " + MESSAGE);

    /************************
      Checks for admin commands, which start with /
      ************************/

    if (MESSAGE.startsWith("/") && isAdmin(twilioFrom)) {
      // Admin command: /invite <phone number>, in form +1XXXXXXXXXX
      const inviteUserResponse = await inviteUser(res, MESSAGE);
      if (inviteUserResponse.success) return;
      else if (inviteUserResponse.message) {
        respondTwilioSMS(res, inviteUserResponse.message);
        return;
      }

      // Admin command: ETC ETC

      // Admin command: ETC ETC

      // Admin command: ETC ETC
    }

    /************************
      TEXT CLASSIFIER: GPT3 ADA
      ************************/

    const textClassification = await openai
      .createCompletion({
        model: process.env.CLASSIFIER_MODEL_NAME,
        prompt: MESSAGE + "-->", // Model trained with --> at end of prompt
        max_tokens: 1,
      })
      .then((response) => parseInt(response.data.choices[0].text.trim()));

    switch (textClassification) {
      case TextClassifications.Fitness:
        // Nothing here -- continue along the flow
        break;
      case TextClassifications.Dashboard:
        respondTwilioSMS(res, getDashboardMsg(customer));
        return;
      case TextClassifications.Premium:
        respondTwilioSMS(res, getPremiumMsg(customer));
        return;
      default:
        respondTwilioSMS(res, getFilterErrorMsg());
        return;
    }

    // TODO: Make a better model with better data
    // Checks if it's about fitness
    const isAboutFitness = await openai
      .createCompletion({
        model: "curie:ft-full-moon-ai-2023-02-25-06-07-10",
        prompt: MESSAGE + "-->", // Model trained with --> at end of prompt
        max_tokens: 1,
      })
      .then((response) => parseInt(response.data.choices[0].text.trim()));

    if (isAboutFitness !== 1) {
      respondTwilioSMS(res, getFilterErrorMsg());
      return;
    }

    /************************
     * Checks if the user has sent a message in the last 2 hours
     * If so, send a message to the user saying they can't send another message
     * ************************/

    const recentMessages: RequestAndResponse[] = await getRecentMessages(
      customer.phone
    );

    const messages = [];
    messages.push({
      role: "system",
      content: `You are FitScript, a helpful personal trainer that lives in SMS texts. Be concise and informative. The user's name is ${customer.firstname}, do not overuse their name.`,
    });
    // For each request and response, push user request value and then assistant response value
    recentMessages.forEach((message) => {
      messages.push({
        role: "user",
        content: message.request_value,
      });

      messages.push({
        role: "assistant",
        content: message.response_value,
      });
    });

    messages.push({ role: "user", content: MESSAGE });

    console.log("MESSAGES:", messages);

    const gptResponse = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.5,
        max_tokens: 1500, // 10x cheaper than davinci-03!
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((response) => response.data.choices[0].message.content.trim());

    // LOG THE REQUEST AND RESPONSE IN THE DB AS A PAIR
    await insertResAndReq(customer, MESSAGE, gptResponse);

    console.log("gptResponse:", gptResponse);
    respondTwilioSMS(res, gptResponse);
    return;
  } catch (error) {
    console.log(error.message);
    respondTwilioSMS(
      res,
      error.message || "Error - please try again or contact support"
    );
    return;
  }
};

module.exports = twilioWebhook;
export {};
