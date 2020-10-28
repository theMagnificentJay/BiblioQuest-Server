const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const UserModel = sequelize.define("user", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordhash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5],
    },
  },
});

module.exports = UserModel;
