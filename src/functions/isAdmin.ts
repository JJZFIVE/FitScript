require("dotenv").config();

async function isAdmin(client: any, twilioFrom: string) {
  const sql = `SELECT * FROM CUSTOMER WHERE phone LIKE '${twilioFrom}'`;
  const { rows } = await client.query(sql);
  const customer = rows[0];

  if (!customer || !customer.is_admin) return false;
  return true;
}

module.exports = isAdmin;

export {};
