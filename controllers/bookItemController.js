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
        owner: owner,
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
      message: `Book failed to be added to list.`,
    });
  }
});

/****************************
 * UPDATE BOOK ITEM (two values available to update, listID and read.)
 ****************************/

bookItemController.route("/update/:id").put(async (req, res) => {
  const listOwner = req.user.id;
  const bookID = req.params.id;
  const { newListTitle, read } = req.body;
  try {
    if (newListTitle) {
      await BookListModel.findOne({
        where: { title: newListTitle, owner: listOwner },
      }).then((data) => {
        BookItemModel.update(
          { listID: data.id, read: read },
          { returning: true, where: { id: bookID } }
        )
          .then(([rowsUpdate, [updatedBook]]) => {
            res.status(200).json({
              updatedBook,
              message: "Book list updated",
            });
          })
          .catch((err) => {
            res.status(500).json({ message: `Update failed ${err}` });
          });
      });
    } else {
      BookItemModel.update(
        { read },
        { returning: true, where: { id: bookID } }
      ).then(([rowsUpdate, [updatedBook]]) => {
        res
          .status(200)
          .json({
            updatedBook,
            message: "read status updated",
          })
          .catch((err) => {
            res.status(500).json({ message: `Update failed: ${err}` });
          });
      });
    }
  } catch (err) {
    res.status(500).json({
      result: err,
      message: `Book failed to be updated. New list or book unfound. ${err}`,
    });
  }
});

/******************************
 * GET SINGLE BOOK
 ******************************/
bookItemController.get("/singleBook/:id", async (req, res) => {
  const bookID = req.params.id;
  const ownerID = req.user.id;
  try {
    BookItemModel.findOne({ where: { id: bookID, ownerID: ownerID } }).then(
      (data) => {
        if (data !== null) {
          res.status(200).json({
            data,
          });
        } else {
          res.status(404).json({
            message: "No book found",
          });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ err, message: "Server Error" });
  }
});

/******************************
 * GET ALL BOOKS FOR LIST
 ******************************/

bookItemController.get("/listBooks/:id", async (req, res) => {
  //! The id is for a list, not a book!
  const listID = req.params.id;
  try {
    BookItemModel.findAll({ where: { listID: listID } }).then((data) => {
      if (data !== null) {
        res.status(200).json({
          data,
        });
      } else {
        res.status(404).json({
          message: "Not list found",
        });
      }
    });
  } catch (err) {
    res.status(500).json({ err, message: "Server Error" });
  }
});

module.exports = bookItemController;
