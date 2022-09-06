const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Importing the users model. */
const KelasDB = require("../models/kelas");
const KehadiranDB = require("../models/kehadiran");

// Importing the response object from express. */
const res = require("express/lib/response");
const randomCode = require("../../lib/generateRandomCode");

const count = require("../../lib/getDistance");

exports.AddNewClass = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  const AddClass = () => {
    const owner_email = req.user.email;
    const class_code =
      req.body.class_name + randomCode.findUniqCode().toString();
    const class_name = req.body.class_name;
    const description = req.body.description;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    // ? CONVERT METER TO KM
    const radius = req.body.radius / 1000.0;

    // console.log(req.user);
    const PostData = new KelasDB({
      owner_email: owner_email,
      class_name: class_name,
      class_code: class_code,
      description: description,
      latitude: latitude,
      longitude: longitude,
      radius: radius,
    });

    PostData.save()
      .then((result) => {
        res.status(201).json({
          data: result,
        });
      })
      .catch((err) => console.log(err));
  };

  AddClass();
};

exports.AddNewPresence = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  const NewPresence = () => {
    const class_code = req.body.class_code;
    const user_email = req.user.email;
    const student_name = req.body.student_name;
    const student_npm = req.body.student_npm;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const PostData = new KehadiranDB({
      class_code: class_code,
      user_email: user_email,
      student_npm: student_npm,
      student_name: student_name,
      latitude: latitude,
      longitude: longitude,
    });

    KelasDB.find({ class_code: class_code })
      .then((resultFindByCodeClass) => {
        //   todo : jika kelas ditemukan
        if (resultFindByCodeClass.length > 0) {
          // todo : count distance between class position and user position
          const distance = count.distance(
            resultFindByCodeClass[0]["latitude"],
            resultFindByCodeClass[0]["longitude"],
            latitude,
            longitude,
            "M"
          );

          // console.log(distance);
          // todo : jika latitude dan longitude kelas sama dengan punya user
          if (distance <= resultFindByCodeClass[0]["radius"]) {
            //   todo : check if user already presence in the class
            KehadiranDB.find({
              $or: [{ student_npm: student_npm }, { user_email: user_email }],
            }).then((resultKehadiranExist) => {
              if (resultKehadiranExist.length > 0) {
                //   todo : if user presence send response user already presence in the class
                res.status(200).json({
                  message: "Anda sudah hadir dengan npm " + student_npm,
                });
              } else {
                //   todo :  if user is not presence in the class
                PostData.save()
                  .then((result) => {
                    res.status(201).json({
                      message: "Kehadiran is successfully added",
                      data: result,
                    });
                  })
                  .catch((err) => console.log(err));
              }
            });
          } else {
            //   todo : if user is not in the same location
            res.status(200).json({
              message: "Gagal anda tidak berada di lokasi yang sama",
            });
            // ?console.log(resultFindByCodeClass[0]["latitude"]);
          }
        } else {
          // todo : if data not exists send data not found
          res.status(404).json({
            message: "data not found",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  NewPresence();
};

exports.GetAllKehadiranByCode = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  const class_code = req.params.class_code;

  console.log(class_code);

  KehadiranDB.find({ class_code: class_code })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          data: result,
        });
      } else {
        res.status(400).json({
          message: "Data not found",
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.GetAllClassesByEmail = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  const user_email = req.params.user_email;
  if (req.user.email == user_email) {
    KelasDB.find({ owner_email: user_email })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({
            data: result,
          });
        } else {
          res.status(400).json({
            message: "Data not found",
          });
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.status(403).json({
      message: "Forbidden",
    });
  }
};
