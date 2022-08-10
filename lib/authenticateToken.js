const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // todo : bearer <jwt>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ status: 403, "message ": "Invalid Access Token" });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
