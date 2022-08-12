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
    body("radius").isNumeric().withMessage("radius is not a number"),
  ],
  authenticate.authenticateToken,
  kelasController.AddNewClass
);

// TODO : [GET] v1/class/user_email
router.get(
  "/:user_email",
  authenticate.authenticateToken,
  kelasController.GetAllClassesByEmail
);

// TODO : [POST] v1/class/presence
router.post(
  "/presence",
  authenticate.authenticateToken,
  kelasController.AddNewPresence
);

// TODO : [GET] v1/class/presence/class_code
router.get(
  "/presence/:class_code",
  authenticate.authenticateToken,
  kelasController.GetAllKehadiranByCode
);

module.exports = router;
