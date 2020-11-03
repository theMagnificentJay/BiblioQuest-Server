const { BookListModel } = require("../models/modelsIndex");
const sequelize = require("../db");
const { Router } = require("express");

const bookListController = Router();

/***********************
 * CREATE LIST
 ***********************/

bookListController.post("/newList", async (req, res) => {
  const owner = req.user.id;
  const { title } = req.body;
  try {
    let listCheck = await BookListModel.findOne({
      where: { owner: owner, title: title }, // * one User cannot use same list title twice.
    });
    if (listCheck !== null) {
      res.status(400).json({
        message: "List aleady exists.",
      });
    } else {
      let newList = BookListModel.create({
        owner: owner,
        title: title,
      });
      res.status(201).json({
        result: newList,
        message: "List created",
      });
    }
  } catch (err) {
    {
      res.status(500).json({
        message: "Failed to create list.",
      });
    }
  }
});

//TBS 10.29.2020: Add Display All list
/***********************
 * DISPLAY ALL LISTS FOR OWNER
 ***********************/
bookListController.get("/allLists", async (req, res) => {
  const bookListOwner = req.user.id;

  try {
    let allLists = await BookListModel.findAll({
      where: { owner: bookListOwner },
    }).then((data) => {
      // if list(s) returned, display the list(s); else display message
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: "No lists found." });
      }
    });
  } catch (err) {
    {
      res.status(500).json({
        message: `Failed to retrieve lists ${err}`,
      });
    }
  }
});

//TBS 10.29.2020: Add Display Single list
/***********************
 * DISPLAY SINGLE LIST
 ***********************/
bookListController.get("/singleList/:id", async (req, res) => {
  const listID = req.params.id;
  const listOwner = req.user.id;

  try {
    let singleList = await BookListModel.findOne({
      where: { id: listID, owner: listOwner },
    }).then((data) => {
      // if list returned, display the list; else display message
      if (data !== null) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: "List not found." });
      }
    });
  } catch (err) {
    {
      res.status(500).json({
        message: `Failed to retrieve lists ${err}`,
      });
    }
  }
});

//TBS 10.30.2020: Add Update list
/***********************
 * UPDATE LIST
 ***********************/
bookListController.put("/update/:id", async (req, res) => {
  const listID = req.params.id;
  const listOwner = req.user.id;
  const updatedTitle = req.body.title;

  try {
    // select a list where id = listID and owner = listowner
    let updateList = await BookListModel.findOne({
      where: { id: listID, owner: listOwner },
    });
    //  if updatelist and updatedTitle both exist,
    //  update title to updatedTitle, and respond with status(200) and message.
    //  else respond with status(404) and message.
    if (updateList && updatedTitle) {
      updateList.update({ title: updatedTitle });
      res.status(200).json({ message: "List successfully updated" });
    } else {
      res
        .status(404)
        .json({ message: "List not found or update unsuccessful." });
    }
  } catch {
    function updateError(err) {
      res.status(500).json( `Failed to retrieve lists ${err}`);
    }
  }
});

/* *******************
 * DELETE LIST
 *********************/
bookListController.delete("/deletelist/:id", async (req, res) => {
  try {
    const removedList = await BookListModel.destroy({
      where: { id: req.params.id },
    }).then((data) => {
      res.status(200).json({ message: "List successfully deleted!" });
    });
  } catch (err) {
    res.status(500).json({
      message: `failed to delete list. ${err}`,
    });
  }
});

module.exports = bookListController;
