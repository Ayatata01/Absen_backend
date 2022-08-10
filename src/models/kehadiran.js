const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Kehadiran = new Schema(
  {
    class_id: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    student_name: {
      type: String,
      required: true,
    },
    student_npm: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Kehadiran", Kehadiran);