//require("dotenv").config(); // Lambda does not like requiring dotenv
const { Configuration, OpenAIApi } = require("openai");
const querystring = require("querystring");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const { Client } = require("pg");
const client = new Client({
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT | 5432,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
});

exports.handler = async (event) => {
  // async function handler(event, context = null) {
  try {
    const str = Buffer.from(event.body, "base64").toString("utf8");
    const body = querystring.parse(str);

    // Extract the relevant information from the request
    const messageFrom = body.From;
    const messageBody = body.Body;

    await client.connect();

    const customer = await client.query(
      "SELECT * FROM CUSTOMER WHERE phone = $1",
      [messageFrom]
    );

    if (!customer.rows.length) {
      throw `Customer not found with phone number ${messageFrom}`;
    }

    const gptResponseData = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: messageBody,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const gptResponse = gptResponseData.data.choices[0].text;

    await client.end();

    return {
      body: gptResponse,
      statusCode: 200,
    };
  } catch (error) {
    await client.end();
    return {
      statusCode: 200,
      body: error.message,
    };
  }
};

// handler({
//   body: JSON.stringify({
//     From: "+13027409745",
//     To: "+13024837626",
//     Body: "Tell me I'm cute.",
//   }),
// });
