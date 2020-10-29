require("dotenv").config();
const express = require("express");
const biblioQuestApp = express();
const sequelize = require("./db");
const controllers = require("./controllers/controllerIndex");

biblioQuestApp.use(express.json());
biblioQuestApp.use(require("./middleware/headers"));

/**********************
 * OPEN ROUTES
 **********************/
biblioQuestApp.use("/user", controllers.User);

/**********************
 * AUTHENTICATED ROUTES
 **********************/
biblioQuestApp.use(
  "/list",
  require("./middleware/validate-session"),
  controllers.List
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
    sequelize.sync();
  })
  .catch((err) => {
    console.error("Unable to connect", err);
  });

biblioQuestApp.listen(3030, () => {
  console.log("BiblioQuest is listening on port 3030");
});
