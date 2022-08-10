const { response } = require("express");
const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const authenticate = require("../../lib/authenticateToken");

// ? CONTROLLER IMPORTS
const authController = require("../controllers/auth");
const kelasController = require("../controllers/kelas");

// TODO : [POST]: v1/class/create
router.post(
  "/create",
  [
    body("class_name").isLength({ min: 1 }).withMessage("class name is empty"),
    body("description")
      .isLength({ min: 1 })
      .withMessage("description is empty"),
    body("latitude")
      .isNumeric()
      .withMessage("latitude is not a number")
      .isLength({ min: 1 })
      .withMessage("latitude is empty"),
    body("longitude")
      .isNumeric()
      .withMessage("longitude is not a number")
      .isLength({ min: 1 })
      .withMessage("latitude is empty"),
  ],
  authenticate.authenticateToken,
  kelasController.AddNewClass
);

// TODO : [POST] v1/class/present
router.post(
  "/presence",
  authenticate.authenticateToken,
  kelasController.AddNewPresence
);
module.exports = router;
