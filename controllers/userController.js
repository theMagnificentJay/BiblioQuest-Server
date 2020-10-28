const UserModel = require("../models/users");
const sequelize = require("../db");
const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");

const userController = Router();

/**************************
 * Register Route
 **************************/

userController.post("/register", async (req, res) => {
  let { email, password } = req.body;
  try {
    await UserModel.create({
      email: email,
      passwordhash: bcrypt.hashSync(password, 10),
    });
    res.status(201).json({
      message: "Success: Account created!",
    });
  } catch (e) {
    if (e instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Account with that email already taken.",
      });
    } else {
      res.status(500).json({
        message: "Registration failed",
      });
    }
  }
});

module.exports = userController;
