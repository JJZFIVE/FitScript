require("dotenv").config();
const pool = require("../db");

import type { Customer, Goal } from "../types/db";
import type { Request, Response } from "express";

const dashboardData = async (req: Request, res: Response) => {
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
    const SELECTCUSTOMER = `SELECT * FROM CUSTOMER WHERE phone = '${phone}'`;
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

    const SELECTGOAL = `SELECT * FROM GOAL WHERE phone = '${phone}'`;
    const goalData = await client.query(SELECTGOAL);
    let goal: Goal | undefined = goalData.rows[0];

    // TODO: Benchmarks
    const benchmarks = {};

    client.release();

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
  }
};

module.exports = dashboardData;

export {};
