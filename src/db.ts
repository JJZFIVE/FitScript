const { Pool } = require("pg");

const POSTGRES_DOCKER_IP = "172.17.0.3";

const pool = new Pool({
  max: 20,
  connectionString: `postgres://postgres@${POSTGRES_DOCKER_IP}:5432/postgres`,
  idleTimeoutMillis: 30000,
});

module.exports = pool;

export {};
