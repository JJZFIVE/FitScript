require("dotenv").config();
const pool = require("../db");
import type { RequestAndResponse } from "../types/db";

async function getRecentMessages(phone: string) {
  const timeDiff = "2 hours";

  const sql = `SELECT req.id, req.timestamp AS request_timestamp, req.value AS request_value, res.value AS response_value
  FROM REQUEST req
  JOIN RESPONSE res ON req.id = res.request_id
  WHERE req.phone = $1
    AND req.timestamp >= NOW() - INTERVAL '${timeDiff}'
  ORDER BY req.timestamp ASC;`;

  const { rows } = await pool.query(sql, [phone]);
  const recentMessages: RequestAndResponse[] = rows as RequestAndResponse[];

  return recentMessages;
}

module.exports = getRecentMessages;

export {};
