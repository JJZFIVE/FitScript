const { Pool } = require("pg");

const pool = new Pool({
  max: 20,
  connectionString: "postgres://postgres@localhost:5432/postgres",
  idleTimeoutMillis: 30000,
});

module.exports = pool;

export {};
