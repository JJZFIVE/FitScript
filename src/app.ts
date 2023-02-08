require("dotenv").config();

const express = require("express");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");

// Routes
const signupHandler = require("./routes/signup");
const twilioWebhook = require("./routes/twilioWebhook");
const getToken = require("./routes/getToken");

// Middleware
const checkToken = require("./middleware/checkToken");

const app = express();
app.use(json());
app.use(cors());
const port = 6969;

const urlencoder = urlencoded({ extended: false });

app.post("/", urlencoder, twilioWebhook);
app.post("/signup", checkToken, signupHandler);
app.get("/get-token", getToken);

app.listen(port, () => {
  console.log(`You son of a bitch, I'm listening on port ${port}`);
});

export {};
