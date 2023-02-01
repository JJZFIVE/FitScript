require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const { spawn } = require("child_process");
const express = require("express");
const { urlencoded } = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const twilioClient = require("twilio");
const getFilterErrorMsg = require("./responses/fitnessfilter/filterErrorMsg");
const getNewUserMsg = require("./responses/signup/newUser");

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

async function sendTwilioSMS(message: any, res: any) {
  // Return specific twilio XML response
  const twiml = new MessagingResponse();
  twiml.message(message);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
}

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
      return res.status(403).send("Invalid request");
    }

    const message = body.Body;
    const twilioFrom = body.From;
    const twilioTo = body.To;
    const twilioMessageSid = body.MessageSid;

    // Run through Python filter to see if it's about fitness
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
          sendTwilioSMS(getFilterErrorMsg(), res);
          return;
        // ADD MORE HERE IF NECESSARY WITH THEIR OWN CODE. A TS ENUM WOULD BE GOOD HERE
      }

      const gptResponse = await openai
        .createCompletion({
          model: "text-davinci-003",
          prompt: message + " Do not include weights yet. (END OF PROMPT)",
          temperature: 0.5,
          max_tokens: 160,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
        .then((response) => response.data.choices[0].text.trim());

      console.log(gptResponse);
      sendTwilioSMS(gptResponse, res);
      return;
    });
  } catch (error) {
    sendTwilioSMS(
      error.message || "Error - please try again or contact support",
      res
    );
    return;
  }
});

app.listen(port, () => {
  console.log(`You son of a bitch, I'm listening on port ${port}`);
});
