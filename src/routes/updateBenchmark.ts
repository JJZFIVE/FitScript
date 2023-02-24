require("dotenv").config();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

import type { Response } from "express";
import type { RequestToken } from "../types/ExpressModified";

type UpdateBenchmarkBody = {
  benchmark: "bench" | "squat" | "deadlift";
  newValue: number;
};

const benchmarkName = {
  bench: {
    tablename: "BENCH_BM",
    returnMessage: "bench press",
  },
  squat: {
    tablename: "SQUAT_BM",
    returnMessage: "back squat",
  },
  deadlift: {
    tablename: "DEADLIFT_BM",
    returnMessage: "standard deadlift",
  },
};

// ADD BAD WORDS CHECKER HERE IN THE GOAL

const updateGoal = async (req: RequestToken, res: Response) => {
  let client;
  try {
    const body: UpdateBenchmarkBody = req.body;
    req.phone = "+13027409745"; // remove this
    const phone = req.phone; // THIS COMES FROM JWT DECODING, phone is in the JWT
    const benchmark = body.benchmark;
    const newValue = body.newValue;

    if (
      !phone ||
      !benchmark ||
      !newValue ||
      !(benchmark == "bench" || benchmark == "squat" || benchmark == "deadlift")
    ) {
      return res.status(500).send({
        success: false,
        message: "Incorrect POST body.",
      });
    }

    const client = await pool.connect();

    const UPDATE = `INSERT INTO ${benchmarkName[benchmark].tablename} (value, phone) VALUES (${newValue}, '${phone}');`;
    await client.query(UPDATE);

    return res.status(200).send({
      success: true,
      message: `Successfully updated your ${benchmarkName[benchmark].returnMessage}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: `Error updating your ${
        benchmarkName[req.body.benchmark].returnMessage
          ? benchmarkName[req.body.benchmark].returnMessage
          : "benchmark"
      }`,
    });
  } finally {
    // This is crucial to ensure client is always released regardless of error
    if (client) client.release();
  }
};

module.exports = updateGoal;

export {};
