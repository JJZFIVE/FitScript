require("dotenv").config();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

import type { Customer, Goal } from "../types/db";
import type { Response } from "express";
import type { RequestToken } from "../types/ExpressModified";

type UpdateGoalBody = {
  setting: "value" | "frequency"; // Can be "value" or "frequency"
  newValue: string;
};

// ADD BAD WORDS CHECKER HERE IN THE GOAL

const updateGoal = async (req: RequestToken, res: Response) => {
  try {
    const body: UpdateGoalBody = req.body;
    req.phone = "+13027409745"; // remove this
    const phone = req.phone; // THIS COMES FROM JWT DECODING, phone is in the JWT
    const setting = body.setting;
    const newValue = body.newValue;

    if (
      !phone ||
      !setting ||
      !newValue ||
      !(setting == "value" || setting == "frequency")
      // todo REGEX ON NEWVALUE FOR 0 or 1 and length 7
    ) {
      return res.status(500).send({
        success: false,
        message: "Incorrect put body.",
      });
    }

    // // TODO with JWT token verification. This verifies that the
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IisxMzAyNzQwOTc0NSIsImlhdCI6MTY3NjMxNzg0MywiZXhwIjoxNjc4OTA5ODQzfQ.Sd9cHJJ28v8pBOpQ6NakfsU9o9YOaKycUIKCfe63xdM";

    // const { error, decoded } = jwt.verify(token, JWT_SECRET);

    // if (error)
    //   return res.status(403).json({ success: false, message: "Invalid token" });

    // console.log(decoded);

    console.log("here");

    const client = await pool.connect();

    const UPDATE = `UPDATE GOAL SET ${setting} = '${newValue}' WHERE phone = '${phone}'`;
    await client.query(UPDATE);

    client.release();

    return res.status(200).send({
      success: true,
      message: `Successfully updated your ${
        setting == "value" ? "goal" : "workout frequency"
      }`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = updateGoal;

export {};
