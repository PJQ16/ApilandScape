const { Sequelize } = require('sequelize');
require('dotenv').config();

const conn = new Sequelize(
  process.env.MYSQL_DB, 
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD, {
  host:process.env.MYSQL_HOSTNAME,
  dialect:'mysql',
  logging:false
});

module.exports = conn