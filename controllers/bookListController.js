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
      where:
        {owner : bookListOwner}
      }).then(
        function findAllSuccess(allLists) {
          if(allList != null){
            res.json(allList)
          } else res.status(501).json({message: "No lists were found."});        
        });
  } catch (err) {
    {
      res.status(500).json({
        message: "Failed to retrieve lists.",
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
      where:
        {id: listID, owner: listOwner}
    }).then(
      function findAllSuccess(singleList) {
          res.json(singleList);
          // TODO handle no lists exist
      // },
      // function findAllError(err) {
      //     res.send(500, err.message);
      });
  } catch (err) {
    {
      res.status(500).json({
        message: "Failed to retrieve list.",
      });
    }
  }
});

module.exports = bookListController;