const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("BiblioQuest", "jonny", "Letmein1234!", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
