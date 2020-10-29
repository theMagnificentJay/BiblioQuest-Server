const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const BookListModel = sequelize.define("bookList", {
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = BookListModel;
