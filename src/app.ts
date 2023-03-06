require("dotenv").config();

// Cron stuff
const cron = require("node-cron");

// Express stuff
const express = require("express");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");

// Functions
const sendMorningTexts = require("./functions/sendMorningTexts");

// Routes
const signupHandler = require("./routes/signup");
const twilioWebhook = require("./routes/twilioWebhook");
const getShortToken = require("./routes/getShortToken");
const login = require("./routes/login");
const dashboardData = require("./routes/dashboardData");
const updateGoal = require("./routes/updateGoal");
const updateBenchmark = require("./routes/updateBenchmark");
const verifyToken = require("./routes/verifyToken");
const checkValidNumber = require("./routes/checkValidNumber");

// Middleware
const checkToken = require("./middleware/checkToken");

const app = express();

app.use(
  cors({
    origin: [
      "https://fit-script-website.vercel.app",
      "https://www.fitscriptnewname.online",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(json());

const port = 6969;

const urlencoder = urlencoded({ extended: false });

app.post("/", urlencoder, twilioWebhook);
app.post("/signup", checkToken, signupHandler);
app.get("/auth/get-short-token", getShortToken);
app.post("/auth/login", login);
app.post("/auth/verify-token", verifyToken);
app.get("/dashboard/data/:phone", checkToken, dashboardData);
app.get("/customer/check-valid-number/:phone", checkValidNumber);
app.put("/customer/update-goal", checkToken, updateGoal);
app.post("/customer/update-benchmark", checkToken, updateBenchmark);

// Schedule cron jobs at 8 am every day
const CRON8AMDAILY = "0 8 * * *";
const CRONEVERYSECOND = "* * * * * *";
const CRONEVERYMINUTE = "* * * * *";

cron.schedule(CRON8AMDAILY, () => {
  sendMorningTexts();
});

// TODO: Cron job to backup database. Can I do this here? Or do I need a different docker container

app.listen(port, () => {
  console.log(`You son of a bitch, I'm listening on port ${port}`);
});

export {};
