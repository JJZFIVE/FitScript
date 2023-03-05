require("dotenv").config();
const pool = require("../db");
const sendTwilioSms = require("../functions/sendTwilioSMS");
const getNewUserMsg = require("../responses/signup/newUser");

import type { Customer } from "../types/db";
import type { Request, Response } from "express";

type SignupHandlerRequest = {
  phone: string;
  firstname: string;
  is_admin: boolean;
};

const signupHandler = async (req: Request, res: Response) => {
  try {
    const body: SignupHandlerRequest = req.body;
    const phone = body.phone;
    const firstname = body.firstname;

    if (!phone || !firstname) {
      return res.status(400).send({
        success: false,
        message: "Missing required parameters.",
      });
    }

    const SELECT = `SELECT * FROM CUSTOMER WHERE phone = $1`;
    const { rows } = await pool.query(SELECT, [phone]);
    let customer: Customer | undefined = rows[0];

    // If customer, resend the text
    if (customer) {
      sendTwilioSms(phone, `Hey ${firstname}, welcome back to FitScript!`);

      return res.status(200).send({
        success: true,
        message: "User already exists with that phone number. Message re-sent.",
      });
    }

    const INSERT = "INSERT INTO CUSTOMER (phone, firstname) VALUES ($1, $2);";
    const CREATEGOAL =
      "INSERT INTO GOAL (value, frequency, phone) VALUES ('My goal is to get more fit with FitScript!', '0000000', $1);";
    const QUERY = INSERT + CREATEGOAL;
    await pool.query(QUERY, [phone, firstname]);

    sendTwilioSms(phone, getNewUserMsg(firstname));

    return res.status(200).send({
      success: true,
      message: "Successfully added user! Check your texts.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = signupHandler;

export {};
