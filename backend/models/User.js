const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  settings: {
    // setting value
    type: Object,
    required: false,
  },
  roles: {
    //roles
    type: [String],
    required: true,
  },
});

module.exports = userSchema;
