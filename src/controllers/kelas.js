const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Importing the users model. */
const KelasDB = require("../models/kelas");
const KehadiranDB = require("../models/kehadiran");

// Importing the response object from express. */
const res = require("express/lib/response");
const randomCode = require("../../lib/generateRandomCode");

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
    // console.log(req.user);
    const PostData = new KelasDB({
      owner_email: owner_email,
      class_name: class_name,
      class_code: class_code,
      description: description,
      latitude: latitude,
      longitude: longitude,
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
    const class_id = req.body.class_id;
    const user_email = req.user.email;
    const student_name = req.body.student_name;
    const student_npm = req.body.student_npm;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const PostData = new KehadiranDB({
      class_id: class_id,
      user_email: user_email,
      student_npm: student_npm,
      student_name: student_name,
      latitude: latitude,
      longitude: longitude,
    });

    KelasDB.find({ _id: class_id })
      .then((resultFindById) => {
        //   todo : jika kelas ditemukan
        if (resultFindById.length > 0) {
          // todo : jika latitude dan longitude kelas sama dengan punya user
          if (
            resultFindById[0]["latitude"] == latitude &&
            resultFindById[0]["longitude"] == longitude
          ) {
            //   todo : check if user already presence in the class
            KehadiranDB.find({ user_email: user_email }).then(
              (resultKehadiranExist) => {
                if (resultKehadiranExist.length > 0) {
                  //   todo : if user presence send response user already presence in the class
                  res.status(400).json({
                    message: "Anda sudah hadir",
                  });
                  console.log(user_email);
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
              }
            );
          } else {
            //   todo : if user is not in the same location
            res.status(400).json({
              message: "Gagal anda tidak berada di lokasi yang sama",
            });
            // ?console.log(resultFindById[0]["latitude"]);
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
