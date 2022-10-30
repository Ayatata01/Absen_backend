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
    const owner_username = req.user.username;
    const class_code = randomCode.findUniqCode().toString();
    const class_name = req.body.class_name;
    const description = req.body.description;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const status = req.body.status || true;
    // ? CONVERT METER TO KM
    const radius = req.body.radius / 1000.0;

    // console.log(req.user);
    const PostData = new KelasDB({
      owner_email: owner_email,
      owner_username: owner_username,
      class_name: class_name,
      class_code: class_code,
      description: description,
      latitude: latitude,
      longitude: longitude,
      radius: radius,
      status: status,
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

    const tanggalSekarang = () => {
      let today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd;
      return today;
    };

    KelasDB.find({ class_code: class_code })
      .then((resultFindByCodeClass) => {
        //   todo : jika kelas ditemukan
        if (resultFindByCodeClass.length > 0) {
          if (resultFindByCodeClass[0]["status"] == true) {
            // todo : count distance between class position and user position
            const distance = count.distance(
              resultFindByCodeClass[0]["latitude"],
              resultFindByCodeClass[0]["longitude"],
              latitude,
              longitude,
              "M"
            );
            // todo : jika latitude dan longitude kelas sama dengan punya user
            if (distance <= resultFindByCodeClass[0]["radius"]) {
              //   todo : check if user already presence in the class
              KehadiranDB.find({
                $and: [{ class_code: class_code }, { user_email: user_email }],
              }).then((resultKehadiranExist) => {
                if (resultKehadiranExist.length > 0) {
                  //   todo : if user presence send response user already presence in the class
                  res.status(200).json({
                    message: "Anda sudah hadir di kelas",
                  });
                } else {
                  //   todo :  if user is not presence in the class
                  KelasDB.find({ class_code: class_code }).then((data) => {
                    const PostData = new KehadiranDB({
                      class_code: class_code,
                      user_email: user_email,
                      student_npm: student_npm,
                      student_name: student_name,
                      latitude: latitude,
                      longitude: longitude,
                      class_info: data,
                      tanggal_dibuat: "2022-10-31",
                    });
                    PostData.save()
                      .then((result) => {
                        res.status(201).json({
                          message: "Kehadiran anda sudah di simpan",
                          data: result,
                        });
                      })
                      .catch((err) => console.log(err));
                  });
                }
              });
            } else {
              //   todo : if user is not in the same location
              res.status(200).json({
                message: "Gagal, anda tidak berada di lokasi yang sama",
              });
              // ?console.log(resultFindByCodeClass[0]["latitude"]);
            }
          } else {
            res.status(200).json({
              message: "Kelas sedang offline",
            });
          }
        } else {
          // todo : if data not exists send data not found
          res.status(404).json({
            message: "Kelas tidak ada",
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
  const tanggal = req.params.tanggal;
  const tgl = req.body.tanggal;

  console.log(tgl === "2022-10-30");

  KehadiranDB.find({
    $and: [{ class_code: class_code }, { tanggal_dibuat: tgl }],
  })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          data: result,
        });
      } else {
        res.status(400).json({
          message: "Kehadiran tidak ditemukan",
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

exports.GetAllKehadiranByUserEmail = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  const user_email = req.params.user_email;

  if (req.user.email == user_email) {
    KehadiranDB.find({ user_email: user_email })
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

exports.DeleteClassByClassCode = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  class_code = req.params.class_code;

  KelasDB.find({ class_code: class_code }).then((data) => {
    if (data.length > 0) {
      if (data[0].owner_email === req.user.email) {
        KehadiranDB.deleteMany({ class_code: class_code }).then(() => {
          KelasDB.deleteOne({ class_code: class_code }).then(() => {
            res.status(200).json({
              message: `Kelas berhasil di hapus`,
            });
          });
        });
      }
    } else {
      res.status(404).json({
        message: "Kelas tidak ditemukan",
      });
    }
  });
};

exports.DeleteKehadiranByClassCode = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  class_code = req.params.class_code;

  // KehadiranDB.find({ class_code: class_code }).then((data) => {
  //   console.log(data);
  // });
  KehadiranDB.deleteOne({
    $and: [{ class_code: class_code, user_email: req.user.email }],
  }).then(() => {
    res.status(200).json({
      message: "Kehadiran berhasil dihapus",
    });
  });
};

exports.SearchKelasByClassName = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  class_name = req.params.class_name;

  KelasDB.find({
    $and: [
      { class_name: { $regex: class_name, $options: "i" } },
      { owner_email: { $regex: req.user.email } },
    ],
  }).then((data) => {
    res.status(200).json({
      data,
    });
  });
};

exports.SearchPresenceByClassName = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  class_name = req.params.class_name;

  KehadiranDB.find({
    $and: [
      {
        class_info: {
          $elemMatch: { class_name: { $regex: class_name, $options: "i" } },
        },
      },
      { user_email: { $regex: req.user.email } },
    ],
  }).then((data) => {
    res.status(200).json({
      data,
    });
  });
};

exports.UpdateKelasByClassCode = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  const id = req.params.id;
  const status = req.body.status;

  KelasDB.findById(id)
    .then((data) => {
      if (!data) {
        const err = new Error("Data Tidak Ditemukan");
        err.errorStatus = 400;
        throw err;
      }

      data.owner_email = data.owner_email;
      data.owner_username = data.owner_username;
      data.class_code = data.class_code;
      data.class_name = data.class_name;
      data.description = data.description;
      data.latitude = data.latitude;
      data.longitude = data.longitude;
      data.radius = data.radius;
      data.status = status;

      return data.save();
    })
    .then((savedData) => {
      res.status(200).json({
        class_code: savedData.class_code,
        status: savedData.status,
      });
    })
    .catch((err) => next(err));
};

exports.PresenceCountByOwnerEmail = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.message = errors;

    throw err;
  }

  const owner_email = req.user.email;
  const countKehadiran = [];
  const countClassName = [];

  // KehadiranDB.find({
  //   class_info: { $elemMatch: { owner_email: owner_email } },
  // }).then((data) => {
  //   data.map((value) => {
  //     // console.log(value.class_code);
  //     countClassCode.push(value.class_code);
  //   });
  //   console.log(countClassCode);
  // });

  KehadiranDB.aggregate([
    { $match: { class_info: { $elemMatch: { owner_email: owner_email } } } },
    { $unwind: "$class_info" },
    {
      $group: {
        _id: "$class_info.class_code",
        KodeCount: { $sum: 1 },
        Subject: { $push: "$class_info.class_name" },
        Class: { $push: "$class_info.class_name" },
      },
    },
    {
      $project: {
        KodeCount: 1,
        ClassCount: { $size: "$Subject" },
        Class: "$Class",
      },
    },
  ]).then((data) => {
    data.map((value) => {
      // console.log(value);
      const hitungKelas = value.Class.length;
      countKehadiran.push(value.KodeCount);
      countClassName.push(value.Class[hitungKelas - 1] + "_" + value._id);
    });
    // console.log(countClassName);
    // console.log(countKehadiran);
    res.status(200).json({
      ClassName: countClassName,
      CountResult: countKehadiran,
    });
  });
};
