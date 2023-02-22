require("dotenv").config();
const pool = require("../db");

import type { Customer, Goal } from "../types/db";
import type { Request, Response } from "express";

const dashboardData = async (req: Request, res: Response) => {
  let client;
  try {
    const phone = req.params.phone;

    if (!phone) {
      return res.status(400).send({
        success: false,
        message: "Missing phone.",
      });
    }

    const client = await pool.connect();

    // Select customer
    const SELECTCUSTOMER = `SELECT * FROM CUSTOMER WHERE phone = '${phone}';`;
    const selectData = await client.query(SELECTCUSTOMER);
    let customer: Customer | undefined = selectData.rows[0];

    // If not customer, error
    if (!customer) {
      return res.status(404).send({
        success: false,
        message: "User not found with that phone number.",
      });
    }

    // Select goal and benchmarks info

    const SELECTGOAL = `SELECT * FROM GOAL WHERE phone = '${phone}';`;
    const goalData = await client.query(SELECTGOAL);
    let goal: Goal | undefined = goalData.rows[0];

    // Benchmarks
    enum BenchmarkQueries {
      Bench = 0,
      Squat = 1,
      Deadlift = 2,
    }
    const BENCH_QUERY = `SELECT value FROM BENCH_BM WHERE phone = '${phone}' ORDER BY timestamp DESC LIMIT 1;`;
    const SQUAT_QUERY = `SELECT value FROM SQUAT_BM WHERE phone = '${phone}' ORDER BY timestamp DESC LIMIT 1;`;
    const DEADLIFT_QUERY = `SELECT value FROM DEADLIFT_BM WHERE phone = '${phone}' ORDER BY timestamp DESC LIMIT 1;`;
    const SELECTBENCHMARKS = BENCH_QUERY + SQUAT_QUERY + DEADLIFT_QUERY;

    const benchmarkData = await client.query(SELECTBENCHMARKS);
    const bench = benchmarkData[BenchmarkQueries.Bench].rows[0]?.value;
    const squat = benchmarkData[BenchmarkQueries.Squat].rows[0]?.value;
    const deadlift = benchmarkData[BenchmarkQueries.Deadlift].rows[0]?.value;

    const benchmarks = { bench: bench, squat: squat, deadlift: deadlift };

    return res.status(200).send({
      success: true,
      message: "Sending customer information to dashboard",
      customer: customer,
      goal: goal,
      benchmarks: benchmarks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  } finally {
    // This is crucial to ensure client is always released regardless of error
    if (client) client.release();
  }
};

module.exports = dashboardData;

export {};
