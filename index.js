const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");

// ROUTER IMPORTS
const authRouter = require("./src/routers/auth");
const kelasRouter = require("./src/routers/kelas");

const app = express();

const port = 5000;

app.listen(port, () => {
  console.log("listening on port " + port);
});

// ACCESS CORS ORIGIN, WHAT WRB IS ALLOWED TO ACCESS THE SERVER
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization , x-api-key"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("hello world");
});

// CONNECT TO DATABASE
mongoose
  .connect(
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-ebr47ew-shard-00-00.kgineap.mongodb.net:27017,ac-ebr47ew-shard-00-01.kgineap.mongodb.net:27017,ac-ebr47ew-shard-00-02.kgineap.mongodb.net:27017/?ssl=true&replicaSet=atlas-8wuxwj-shard-0&authSource=admin&retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connection To Database Success");
  })
  .catch((err) => {
    console.log(`error : ${err}`);
  });

// DEFINE BODY PARSER
app.use(bodyParser.json());

// ROUTERS
app.use("/v1/auth", authRouter);
app.use("/v1/kelas", kelasRouter);

// ERROR GLOBAL DARI SETIAP CONTROLLER
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    status: status,
    message: message,
    data: data,
  });
});
