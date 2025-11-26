const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: `${process.cwd()}/.env` });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    port: process.env.DB_PORT || 3306,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = { sequelize };
