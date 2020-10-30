const { BookItemModel, BookListModel } = require("../models/modelsIndex");
const sequelize = require("../db");
const { Router } = require("express");

const bookItemController = Router();

/**************************
 * CREATE BOOK LIST ITEM
 **************************/

bookItemController.post("/addBook", async (req, res) => {
  const owner = req.user.id; //user who owns the list
  const {
    listTitle, //title of list to which the book belongs
    title,
    subTitle,
    author,
    read,
    description,
    costRetail,
    length,
    category,
    publisher,
    publicationDate,
    ISBN,
    smallThumbnailURL,
    thumbnailURL,
  } = req.body.book; //all information should be put inside a book object
  try {
    const bookList = await BookListModel.findOne({
      //find the list to be associated with book
      where: {
        title: listTitle,
      },
    });
    if (bookList === null) {
      //No such list? Throw error.
      res.status(404).json({
        message: "No list found",
      });
    } else {
      let newBook = await BookItemModel.create({
        //create book tied to list id
        listID: bookList.id,
        ownerID: owner,
        title,
        subTitle,
        author,
        read,
        description,
        costRetail,
        length,
        category,
        publisher,
        publicationDate,
        ISBN,
        smallThumbnailURL,
        thumbnailURL,
      });
      res.status(200).json({
        result: newBook,
        message: "Book added to list.",
      });
    }
  } catch (err) {
    res.status(500).json({
      result: err,
      message: `Book failed to be added to list. ${err}`,
    });
  }
});

module.exports = bookItemController;
