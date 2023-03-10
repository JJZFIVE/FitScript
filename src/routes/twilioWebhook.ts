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

import type { Customer } from "../types/db";
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
    // Have to do this errored method instead of catch block due to child process.on() for Python
    let errored = 0;

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

    const message = body.Body.trim();
    const twilioFrom = body.From;

    /************************
      Checks if there's a user in the database with the phone number
      ************************/

    const sql = `SELECT * FROM CUSTOMER WHERE phone = '${twilioFrom}'`;
    const { rows } = await pool.query(sql);
    let customer: Customer | undefined = rows[0];

    if (!customer) {
      respondTwilioSMS(res, getNoUserMsg());
      return;

      // FOR BLAINE TESTING
      // customer = {
      //   phone: twilioFrom,
      //   firstname: "",
      //   is_admin: true,
      //   date_registered: new Date("2023-02-05T23:58:36.745Z"),
      //   premium: false,
      //   benchmark_page_secret_code: "6d2e0b",
      //   benchmark_page_prettier_id: "d8609772",
      //   recent_code_refresh: new Date("2023-02-05T23:58:36.745Z"),
      // };
    }

    console.log("INCOMING MESSAGE:" + message);

    /************************
      Checks for admin commands, which start with /
      ************************/

    if (message.startsWith("/") && isAdmin(twilioFrom)) {
      // Admin command: /invite <phone number>, in form +1XXXXXXXXXX
      const inviteUserResponse = await inviteUser(res, message);
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
        prompt: message + "-->", // Model trained with --> at end of prompt
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

    // Checks if it's about fitness
    const isAboutFitness = await openai
      .createCompletion({
        model: "curie:ft-full-moon-ai-2023-02-25-06-07-10",
        prompt: message + "-->", // Model trained with --> at end of prompt
        max_tokens: 1,
      })
      .then((response) => parseInt(response.data.choices[0].text.trim()));

    console.log("isAboutFitness response:", isAboutFitness);

    if (isAboutFitness !== 1) {
      respondTwilioSMS(res, getFilterErrorMsg());
      return;
    }

    const gptResponse = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt:
          message + " Do not include weights yet. Be concise. (END OF PROMPT)",
        temperature: 0.5,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((response) => response.data.choices[0].text.trim());

    console.log("gptResponse:", gptResponse);
    respondTwilioSMS(res, gptResponse);
    return;
  } catch (error) {
    respondTwilioSMS(
      res,
      error.message || "Error - please try again or contact support"
    );
    return;
  } finally {
    console.log("Finally block executed for testing purposes");
  }
};

module.exports = twilioWebhook;
export {};
