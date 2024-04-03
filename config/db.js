const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  operatorsAliases: 0,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.payments = require('../model/Payments')(sequelize, Sequelize);
db.cards = require('../model/Cards')(sequelize, Sequelize);
db.users = require('../model/Users')(sequelize, Sequelize);
db.logs = require('../model/Logger')(sequelize, Sequelize);

module.exports = db;