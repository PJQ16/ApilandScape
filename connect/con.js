const { Sequelize } = require('sequelize');
require('dotenv').config();

const conn = new Sequelize(
  process.env.MYSQL_DB, 
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD, {
  host:process.env.MYSQL_HOSTNAME,
  dialect:'mysql',
  logging:false,
  pool: {
    max: 100,
    min: 10,
    acquire: 60000,
    idle: 20000,
  }
});

module.exports = conn