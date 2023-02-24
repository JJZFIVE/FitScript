require("dotenv").config();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const Filter = require("bad-words");
const filter = new Filter();

import type { Customer, Goal } from "../types/db";
import type { Response } from "express";
import type { RequestToken } from "../types/ExpressModified";

type UpdateGoalBody = {
  setting: "value" | "frequency"; // Can be "value" or "frequency"
  newValue: string;
};

// ADD BAD WORDS CHECKER HERE IN THE GOAL

const updateGoal = async (req: RequestToken, res: Response) => {
  let client;
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

    if (filter.isProfane(newValue))
      return res.status(500).send({
        success: false,
        message: "Do not include bad words in your goal!",
      });

    const client = await pool.connect();

    const UPDATE = `UPDATE GOAL SET ${setting} = '${newValue}', timestamp = to_timestamp(${Date.now()} / 1000.0) WHERE phone = '${phone}'`;
    await client.query(UPDATE);

    return res.status(200).send({
      success: true,
      message: `Successfully updated your ${
        setting == "value" ? "goal" : "workout frequency"
      }`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: `Error updating your ${
        req.body.setting == "value" ? "goal" : "workout frequency"
      }`,
    });
  } finally {
    // This is crucial to ensure client is always released regardless of error
    if (client) client.release();
  }
};

module.exports = updateGoal;

export {};
