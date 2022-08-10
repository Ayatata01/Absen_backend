const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

// CONTROLLER IMPORTS
const authController = require("../controllers/auth");

// TODO : [POST] : v1/auth
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("type is not a valid email"),
    body("username").isLength({ min: 1 }).withMessage("username is empty"),
    body("imageUrl").isLength({ min: 1 }).withMessage("imageUrl is empty"),
  ],
  authController.LoginAccess
);
module.exports = router;
