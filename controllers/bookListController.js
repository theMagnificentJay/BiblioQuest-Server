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
    }).then((allLists) => {
      //todo the "allLists" in this line is the promise returned from the findAll, which is good, but it's confusing to give it the same name as the "allLists" on line 40,   which is the function expression variable and would hold the return for the whole list. Notice how it doesn't highlight when you click on the other allListts. I'd change one or the other name, perhaps title the promise return "data" or "json"?
      // if list(s) returned, display the list(s); else display message
      if (allLists.length > 0) {
        res.status(200).json(allLists);
      } else {
        res.status(404).json({ message: "No lists found." });
      }
    });
  } catch (err) {
    {
      res.status(500).json({
        message: "Failed to retrieve lists",
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
    }).then((singleList) => {
      // if list returned, display the list; else display message
      if (singleList !== null) {
        res.status(200).json(singleList);
      } else {
        res.status(404).json({ message: "List not found." });
      }
    });
  } catch (err) {
    {
      res.status(500).json({
        message: "Failed to retrieve list.",
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
      res.send(500, err.message);
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
      res.status(200).json({ message: "List succesfully deleted!" });
    });
  } catch (err) {
    res.status(500).json({
      message: `failed to delete list. ${err}`,
    });
  }
});

module.exports = bookListController;
