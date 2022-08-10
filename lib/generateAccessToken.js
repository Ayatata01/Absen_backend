const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "1m" });
};

module.exports = { generateToken };
