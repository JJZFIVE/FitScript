require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const { spawn } = require("child_process");
const express = require("express");
const { urlencoded } = require("body-parser");
const twilioClient = require("twilio");

// Personal modules
const getFilterErrorMsg = require("./responses/fitnessfilter/filterErrorMsg");
const getNewUserMsg = require("./responses/signup/newUser");
const inviteUser = require("./responses/admin-commands/invite");
const respondTwilioSMS = require("./functions/respondTwilioSMS");

const app = express();
app.use(urlencoded({ extended: false }));
const port = 6969;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Twilio config
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const WEBHOOKURL = process.env.WEBHOOKURL; // This is the URL that Twilio will send the webhook to

// Main webhook when they respond to our Twilio SMS
// Future versions will branch conditionally off from here, but this is the main component of the app
app.post("/", async (req, res) => {
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
    const twilioTo = body.To;
    const twilioMessageSid = body.MessageSid;

    /************************
    Checks for admin commands, which start with /
    ************************/

    if (message.startsWith("/") && twilioFrom === process.env.ADMIN_NUMBER) {
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
    Not an admin command, so continue with normal flow
    ************************/

    const pythonProcess = spawn("python", [
      "fitnessfilter/test_model.py",
      message,
    ]);
    const charCodeZero = "0".charCodeAt(0);

    pythonProcess.stdout.on("data", async (data) => {
      // Data is returned in Buffer format, with format <Buffer 5b 31 5d 0a> (e.g. [1]\n)
      const isAboutFitness = data[1] - charCodeZero; // 1 = true, 0 = false

      if (isAboutFitness !== 1) {
        errored = 1;
      }

      switch (errored) {
        // Is about fitness and passes all checks
        case 0:
          break;
        // Is not about fitness
        case 1:
          respondTwilioSMS(res, getFilterErrorMsg());
          return;
        // ADD MORE HERE IF NECESSARY WITH THEIR OWN CODE. A TS ENUM WOULD BE GOOD HERE
      }

      console.log("Going into GPT3 with message:" + message + "...");
      const gptResponse = await openai
        .createCompletion({
          model: "text-davinci-003",
          prompt: message + " Do not include weights yet. (END OF PROMPT)",
          temperature: 0.5,
          max_tokens: 100,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
        .then((response) => response.data.choices[0].text.trim());

      console.log("GPT-3 response: " + gptResponse);
      respondTwilioSMS(res, gptResponse);
      return;
    });
  } catch (error) {
    respondTwilioSMS(
      res,
      error.message || "Error - please try again or contact support"
    );
    return;
  }
});

app.listen(port, () => {
  console.log(`You son of a bitch, I'm listening on port ${port}`);
});
