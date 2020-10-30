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

/****************************
 * UPDATE BOOK ITEM (two values available to update, listID and read.)
 ****************************/

bookItemController.put("/update", (req, res) => {
  //   let bookID = req.params.id;
  //todo update to take req.params
  let { newListTitle, read, bookID } = req.body;
  let newListID = 0;

  try {
    console.log("in the try Block");
    BookListModel.findOne({
      where: { title: newListTitle },
    }).then((data) => {
      newListID = data.id;
      console.log(newListID);
    });
  } catch (err) {
    res.status(500).json({
      result: err,
      message: `No list found. ${err}`,
    });
  }

  try {
    BookItemModel.update(
      {
        read: read,
        listID: newListID,
      },
      { returning: true, where: { id: bookID } }
    ).then(([rowsUpdated, bookReturn]) => {
      res.status(202).json({
        bookReturn,
        message: "Book status updated.",
      });
    });
  } catch (err) {
    res.status(500).json({
      result: err,
      message: `Book failed to be updated. ${err}`,
    });
  }
});

module.exports = bookItemController;
