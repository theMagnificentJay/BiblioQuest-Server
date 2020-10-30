const userController = require("./userController");
const bookListController = require("./bookListController");
const bookItemController = require("./bookItemController");

module.exports = {
  User: userController,
  List: bookListController,
  Book: bookItemController,
};
