require("dotenv").config();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

import type { Response } from "express";
import type { RequestToken } from "../types/ExpressModified";

type UpdateBenchmarkBody = {
  benchmark: "bench" | "squat" | "deadlift";
  newValue: number;
  phone: string;
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
  try {
    const body: UpdateBenchmarkBody = req.body;
    req.phone = body.phone;
    const phone = req.phone; // TODO: THIS COMES FROM JWT DECODING, phone is in the JWT
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

    const UPDATE = `INSERT INTO ${benchmarkName[benchmark].tablename} (value, phone) VALUES (${newValue}, '${phone}');`;
    await pool.query(UPDATE);

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
    console.log("Finally block executed for testing purposes");
  }
};

module.exports = updateGoal;

export {};
