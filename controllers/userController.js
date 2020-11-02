const { UserModel } = require("../models/modelsIndex");
const sequelize = require("../db");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const validateSession = require("../middleware/validate-session");
const users = [];

const userController = Router();

/**************************
 * Register Route
 **************************/

userController.post("/register", async (req, res) => {
  let { email, password } = req.body;
  if (password.length >= 5) {
    try {
      await UserModel.create({
        email: email,
        passwordhash: bcrypt.hashSync(password, 10),
      });
      res.status(201).json({
        message: "Success: Account created!",
      });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        res.status(409).json({
          message: "Account with that email already taken.",
        });
      } else {
        res.status(500).json({
          message: "Registration failed",
        });
      }
    }
  } else {
    res.status(406).json({
      message: "Password must be equal to or more than 5 characters.",
    });
  }
});

/************************
 * Login Route
 ************************/

userController.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    let loginUser = await UserModel.findOne({
      where: { email: email },
    });
    if (loginUser && (await bcrypt.compare(password, loginUser.passwordhash))) {
      const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET);
      res.status(200).json({
        message: "Login successful",
        token: token,
      });
    } else {
      res.status(401).json({
        message: "Login Failed",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: `Error Logging In: ${err}`,
    });
  }
});

/* ******************
 * Delete User Route
 ********************/
userController.delete("/:id", validateSession, async (req, res, next) => {
  try {
    const removedUser = await UserModel.remove({ id: req.params.id });
    res.json(removedUser);
  } catch (err) {
    res.status(500).json({
      message: "failed to delete user.",
    });
  }
});

// userController.delete("/deleteuser/:id", validateSession, async (req, res, next) => {
// const {id} = req.params.id;
// // // const deletedUser =  users.find(user => user.id === id);
// // const deletedUser =  ;
// UserModel.findOneAndRemove()

//   } else {
//     res.status(401).json({
//       message: "Delete User Failed",
//     });
//   }
// } catch (err) {
//   res.status(500).json({
//     message: `Error Deleting User: ${err}`,
//   });
// }
module.exports = userController;
