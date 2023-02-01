require("dotenv").config();
const { Client } = require("pg");

const test = async (event) => {
  const client = new Client({
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT | 5432,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
  });

  await client.connect();

  try {
    const now = new Date();
    const createTable =
      "CREATE TABLE IF NOT EXISTS CUSTOMER \
      (id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY, \
      name VARCHAR(255), \
      phone VARCHAR(20) UNIQUE NOT NULL, \
      date_registered TIMESTAMP NOT NULL)";
    await client.query(createTable);
    const insert =
      "INSERT INTO CUSTOMER (name, phone, date_registered) VALUES ($1, $2, $3)";
    await client.query(insert, ["Joe", "+13027409745", now]);
    //await client.query(insert, ["Blaine", "+13025881620", now]);
    const res = await client.query("SELECT * FROM CUSTOMER");
    console.log(res.rows);

    // const res = await client.query("DROP TABLE CUSTOMER");
    // console.log(res);
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
};

test();
