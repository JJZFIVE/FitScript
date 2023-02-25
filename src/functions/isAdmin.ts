require("dotenv").config();
const pool = require("../db");

async function isAdmin(twilioFrom: string) {
  const sql = `SELECT * FROM CUSTOMER WHERE phone = '${twilioFrom}';`;
  const { rows } = await pool.query(sql);
  const customer = rows[0];

  if (!customer || !customer.is_admin) return false;
  return true;
}

module.exports = isAdmin;

export {};
