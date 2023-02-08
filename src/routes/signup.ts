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

type SignupHandlerResponse = {
  success: boolean;
  message?: string;
};

const signupHandler = async (req: Request, res: Response) => {
  try {
    const body: SignupHandlerRequest = req.body;
    const phone = body.phone;
    const firstname = body.firstname;

    console.log(body);

    if (!phone || !firstname) {
      return res.status(400).send({
        success: false,
        message: "Missing required parameters.",
      });
    }

    const client = await pool.connect();
    const SELECT = `SELECT * FROM CUSTOMER WHERE phone = '${phone}'`;
    const { rows } = await client.query(SELECT);
    let customer: Customer | undefined = rows[0];

    // If customer, resend the text
    if (customer) {
      client.release();

      sendTwilioSms(
        phone,
        `Hey ${firstname}, welcome back to FitScript! We already have you in our database, but second time's the charm!`
      );

      return res.status(200).send({
        success: true,
        message: "User already exists with that phone number. Message re-sent.",
      });
    }

    const INSERT = `INSERT INTO CUSTOMER (phone, firstname) VALUES ('${phone}', '${firstname}')`;
    await client.query(INSERT);

    client.release();

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
