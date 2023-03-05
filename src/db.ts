require("dotenv").config();
const { Pool } = require("pg");

const POSTGRES_DOCKER_IP =
  process.env.NODE_ENV == "dev" ? "localhost" : "172.17.0.2";

const PORT = 5432;
const DATABASE = "postgres";
const USER = "postgres";
// Note: password cannot be null or else there's a docker connection issue
const PASSWORD = process.env.NODE_ENV == "dev" ? "" : "fitscriptpassword";

const pool = new Pool({
  max: 50,
  connectionString: `postgres://${DATABASE}:${PASSWORD}@${POSTGRES_DOCKER_IP}:${PORT}/${USER}`,
  idleTimeoutMillis: 30000,
});

module.exports = pool;

export {};
