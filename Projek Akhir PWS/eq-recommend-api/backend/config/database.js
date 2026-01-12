// backend/config/database.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, // pastikan sama dengan .env
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // <-- pakai DB_PORT
    dialect: "mysql",
    logging: false, // set true kalau mau lihat query
  }
);

module.exports = sequelize;
