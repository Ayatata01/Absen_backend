const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Kelas = new Schema(
  {
    owner_email: {
      type: String,
      required: true,
    },
    owner_username: {
      type: String,
      required: true,
    },
    class_code: {
      type: String,
      required: true,
    },
    class_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    radius: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Kelas", Kelas);
