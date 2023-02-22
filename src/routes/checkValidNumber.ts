require("dotenv").config();
const pool = require("../db");

import type { Customer, Goal } from "../types/db";
import type { Request, Response } from "express";

const checkValidNumber = async (req: Request, res: Response) => {
  let client;
  try {
    const phone = req.params.phone;
    console.log("Login attempt received:", phone);

    if (!phone) {
      return res.status(400).send({
        success: false,
        message: "Missing phone parameter",
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

    return res.status(200).send({
      success: true,
      message: "Valid phone number",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  } finally {
    // This is crucial to ensure client is always released regardless of error
    if (client) client.release();
  }
};

module.exports = checkValidNumber;

export {};
