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
    sequelize.sync();
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Unable to connect", err);
  });

biblioQuestApp.listen(process.env.PORT, () => {
  console.log(`BiblioQuest is listening on port ${process.env.PORT}`);
});
