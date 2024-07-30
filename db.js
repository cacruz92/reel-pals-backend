// Database setup for Reel Pals

const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///reel_pals_test";
} else {
  DB_URI = "postgresql:///reel_pals";
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;