const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");

const BookItemModel = sequelize.define("book", {
  listID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ownerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  author: {
    type: DataTypes.ARRAY(Sequelize.TEXT),
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  description: {
    //TODO throws errors for long descriptions
    type: DataTypes.STRING(1234),
    allowNull: true,
  },
  costRetail: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  category: {
    type: DataTypes.ARRAY(Sequelize.TEXT),
    allowNull: true,
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publicationDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ISBN: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  smallThumbnailURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumbnailURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = BookItemModel;
