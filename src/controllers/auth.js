const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// ? Importing the users model. */
const UsersDB = require("../models/users");
// ? Importing the response object from express. */
const res = require("express/lib/response");
const genToken = require("../../lib/generateAccessToken");

exports.LoginAccess = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  const LoginChecking = () => {
    const email = req.body.email;
    const username = req.body.username;
    const imageUrl = req.body.imageUrl;

    const PostData = new UsersDB({
      email: email,
      username: username,
      imageUrl: imageUrl,
    });

    const user = {
      email: req.body.email,
    };

    UsersDB.find({ email: email })
      .then((resultFindByEmail) => {
        // *  console.log(resultFindByEmail.length >= 1);
        // *  console.log(resultFindByEmail);
        if (resultFindByEmail.length > 0) {
          // TODO : IF USER EXIST GIVE TOKEN
          const accessToken = genToken.generateToken(user);
          res.status(200).json({
            accessToken,
          });
        } else {
          // TODO : IF USER NOT EXIST MAKE NEW USER AND GIVE TOKEN
          const accessToken = genToken.generateToken(user);
          PostData.save()
            .then((result) => {
              res.status(201).json({
                accessToken,
              });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  LoginChecking();
};
