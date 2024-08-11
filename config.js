const { get } = require("http");

require("dotenv").config();
require("colors");
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET || "bigboydeluxe";
console.log("JWT_SECRET:", JWT_SECRET);
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Reel Pals Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

function getDatabaseUri(){
    return (process.env.NODE_ENV === "test")
    ? "postgresql:///reel_pals_test"
    : process.env.DATABASE_URL || "postgresql:///reel_pals";
}

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
    JWT_SECRET
};