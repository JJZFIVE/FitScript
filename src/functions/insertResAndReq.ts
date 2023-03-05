require("dotenv").config();
const pool = require("../db");
import type { Customer } from "../types/db";

async function getRecentMessages(
  customer: Customer,
  request: string,
  gptResponse: string
) {
  // TODO: Can I do this in one transaction?
  const INSERT_REQUEST = `INSERT INTO REQUEST(value, phone) VALUES(
    $1, $2
  ) RETURNING id;`;

  const { rows } = await pool.query(INSERT_REQUEST, [request, customer.phone]);
  const requestId = rows[0].id;

  const INSERT_RESPONSE = `INSERT INTO RESPONSE(value, request_id) VALUES(
    $1, $2
    );`;

  await pool.query(INSERT_RESPONSE, [gptResponse, requestId]);
}

module.exports = getRecentMessages;

export {};
