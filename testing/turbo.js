require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function handler() {
  try {
    // let MESSAGE =
    "Help me make a workout plan for a bigger chest" +
      " Do not include weights yet. (END OF PROMPT)";

    const firstname = "Joe";

    // Grab all previous messages from this user within the past 2 hours.

    const messages = [
      {
        role: "system",
        content: `You are FitScript, a helpful personal trainer that lives in SMS texts. Be semi concise. The user's name is ${firstname}, do not overuse their name.`,
      },
      { role: "user", content: MESSAGE },
    ];

    const role = "assistant";
    const gptResponse = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.5,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((response) => response.data.choices[0].message.content.trim());

    console.log(gptResponse);
  } catch (error) {
    console.log(error.message);
  }
}

handler();
