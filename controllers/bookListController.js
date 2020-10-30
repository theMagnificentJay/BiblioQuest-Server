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
    let newList = await BookListModel.create({
      owner: owner,
      title: title,
    });
    res.status(201).json({
      result: newList,
      message: "List created",
    });
  } catch (err) {
    {
      res.status(500).json({
        message: "Failed to create list.",
      });
    }
  }
});

module.exports = bookListController;
