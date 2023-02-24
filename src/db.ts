const { Pool } = require("pg");

const POSTGRES_DOCKER_IP = "172.17.0.2";

const PORT = 5432;
const DATABASE = "postgres";
const USER = "postgres";
// Note: password cannot be null or else there's a docker connection issue
let PASSWORD = "fitscriptpassword";

const pool = new Pool({
  max: 20,
  connectionString: `postgres://${DATABASE}:${PASSWORD}@${POSTGRES_DOCKER_IP}:${PORT}/${USER}`,
  idleTimeoutMillis: 30000,
});

module.exports = pool;

export {};
