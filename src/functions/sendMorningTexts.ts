require("dotenv").config();
const pool = require("../db");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function sendMorningTexts(to: string, message: string): Promise<boolean> {
  const phoneNumber =
    process.env.NODE_ENV == "dev" ? "+19849999370" : "+13024837626";

  const now = new Date();

  // Get the day of the week (0-6)
  // Note: 0 is Sunday in JS, but in this system, 0 is Monday. So, subtract 1
  const dayOfWeek = (6 + now.getDay()) % 7;

  enum DayOfWeek {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
  }

  // Output the day of the week
  console.log(`Today is ${DayOfWeek[dayOfWeek]}`);

  // Thank you ChatGPT for this intricate query
  // Note: do only the most recent for a person, if they've input multiple goals, only take the most recent
  const SQL = `SELECT g.value, g.frequency, g.phone, c.firstname
    FROM CUSTOMER c
    INNER JOIN (
    SELECT phone, MAX(timestamp) AS latest_timestamp
    FROM GOAL
    GROUP BY phone
    ) AS latest_goals ON c.phone = latest_goals.phone
    INNER JOIN GOAL g ON g.phone = c.phone AND g.timestamp = latest_goals.latest_timestamp
    WHERE SUBSTR(g.frequency, $1, 1) = '1';
    `;

  // dayOfWeek + 1 because postgres arrays are 1-indexed
  const { rows } = await pool.query(SQL, [dayOfWeek + 1]);
  console.log(rows);

  try {
    // Change rows to queries object, mainly to add ChatGPT query object
    rows.forEach((row) => {
      row.value = [
        {
          role: "system",
          // TODO: Tell FitScript to be [mean, funny, neutral, optimistic, etc]
          content: `You are FitScript, a helpful personal trainer that lives in SMS texts. Be concise. The user's name is ${row.firstname}, do not overuse their name.`,
        },
        {
          role: "user",
          content:
            "Make me my workout for the day. Here's my goal: " +
            `"${row.value}"`,
        },
      ];
    });

    const messagePromises = rows.map((query) =>
      openai
        .createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: query.value,
          temperature: 0.5,
          max_tokens: 1500, // 10x cheaper than davinci-03!
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
        .then((response) => response.data.choices[0].message.content.trim())
    );

    Promise.allSettled(messagePromises).then((results) => {
      console.log("RESULTS", results);
      // Results are in same array index structure as rows
      const outboundTextPromises = [];

      interface PromiseFulfilledResult<T> {
        status: "fulfilled";
        value: T;
      }

      // Build the outbound text promises
      for (let i = 0; i < rows.length; i++) {
        if (results[i].status == "fulfilled") {
          outboundTextPromises.push(
            client.messages.create({
              body: (results[i] as PromiseFulfilledResult<string>).value,
              from: phoneNumber,
              to: rows[i].phone,
            })
          );
        }
      }

      Promise.allSettled(outboundTextPromises).then((results) => {
        console.log("OUTBOUND TEXT RESULTS", results);
      });
    });
  } catch (error) {}

  //   try {
  //     await client.messages.create({
  //       body: message,
  //       from: "+13024837626",
  //       to: to,
  //     });
  //     console.log("MESSAGE SENT TO" + to);
  //     return true;
  //   } catch (error) {
  //     console.log("MESSAGE NOT SENT", error.message);
  //     return false;
  //   }

  return true;
}

module.exports = sendMorningTexts;

export {};
