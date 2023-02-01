require("dotenv").config(); // Lambda does not like requiring dotenv
const { Configuration, OpenAIApi } = require("openai");
const { spawn } = require("child_process");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function handler() {
  try {
    const MESSAGE =
      "Help me make a workout plan for a bigger chest" +
      " Do not include weights yet. (END OF PROMPT)";

    // Run through Python filter to see if it's about fitness
    const pythonProcess = spawn("python", [
      "fitnessfilter/test_model.py",
      MESSAGE,
    ]);
    const charCodeZero = "0".charCodeAt(0);

    pythonProcess.stdout.on("data", (data) => {
      // Data is returned in Buffer format, with format <Buffer 5b 31 5d 0a> (e.g. [1]\n)
      const isAboutFitness = parseInt(data[1] - charCodeZero); // 1 = true, 0 = false

      if (isAboutFitness === 0) {
        throw new Error("Not about fitness");
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      // Data is returned in Buffer format, with format <Buffer 5b 31 5d 0a> (e.g. [1]\n)
      throw new Error(parseInt(data[1] - charCodeZero));
    });

    // pythonProcess.on("close", (code) => {
    //   console.log(`Python script exited with code ${code}`);
    // });

    const gptResponse = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: MESSAGE,
        temperature: 0.5,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((response) => response.data.choices[0].text.trim());

    console.log(gptResponse);
  } catch (error) {
    console.log(error.message);
  }
}

handler();
