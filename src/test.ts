require("dotenv").config();
const poo = require("./db");

async function main() {
  const client = await poo.connect();
  try {
    const sql = "SELECT * FROM CUSTOMER";
    const { rows } = await client.query(sql);

    const c = rows[0];
    console.log(c);
    console.log(
      typeof c.phone,
      typeof c.firstname,
      typeof c.is_admin,
      typeof c.date_registered,
      typeof c.premium,
      typeof c.benchmark_page_secret_code,
      typeof c.benchmark_page_prettier_id,
      c.recent_code_refresh.getMonth()
    );
  } catch (error) {
  } finally {
    client.release();
  }
}

main();

export {};
