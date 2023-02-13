require("dotenv").config();

const express = require("express");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");

// Routes
const signupHandler = require("./routes/signup");
const twilioWebhook = require("./routes/twilioWebhook");
const getShortToken = require("./routes/getShortToken");
const getLongToken = require("./routes/getLongToken");
const dashboardData = require("./routes/dashboardData");
const updateGoal = require("./routes/updateGoal");

// Middleware
const checkToken = require("./middleware/checkToken");

const app = express();
app.use(json());
app.use(cors());
const port = 6969;

const urlencoder = urlencoded({ extended: false });

app.post("/", urlencoder, twilioWebhook);
app.post("/signup", checkToken, signupHandler);
app.get("/auth/get-short-token", getShortToken);
app.get("/auth/get-long-token", getLongToken);
app.get("/dashboard/data/:phone", dashboardData); // TODO: Add checktoken to get dashboard data
app.put("/customer/update-goal", updateGoal); // TODO: add checkToken to update goal

app.listen(port, () => {
  console.log(`You son of a bitch, I'm listening on port ${port}`);
});

export {};
