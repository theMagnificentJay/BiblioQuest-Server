const { BookListModel } = require("../models/modelsIndex");
const sequelize = require("../db");
const { Router } = require("express");

const bookListController = Router();

/***********************
 * CREATE LIST
 ***********************/

bookListController.post("/newList", async (req, res) => {
  const owner = req.user.id;
  const title = req.body.title;
  try {
    let newList = BookListModel.create({
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
      // if list(s) returned, display the list(s); else display message
      if (allLists.length !== 0) {
        res.status(200).json(allLists);
      } else {
        res.status(204).json({ message: "No lists found." });
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
 * DISPLAY SINGLE LIST FOR OWNER
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
          res.status(204).json({ message: "List not found." });
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
bookListController.put("/updateList/:id", async (req, res) => {
  const listID = req.params.id;
  const listOwner = req.user.id;
  const listTitle = req.body.title;

  try {
    let updateList = await BookListModel.update(
      {title: listTitle},
      {where: 
        {id: listID, owner: listOwner}
      });
      // if (updateList && title) {
      //   updateList.title = title;
      //   await updateList.save();
        res.json({
          message: 'Log was successfully updated.'
        });
      // } else 
      // {
      //   res.status(404).json({
      //     message: "List title missing",
      //   });
      } catch { function updateError(err) {
      res.send(500, err.message)
      };
    }  
});

module.exports = bookListController;
