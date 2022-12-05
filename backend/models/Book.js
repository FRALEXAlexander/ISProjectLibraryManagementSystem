const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
    default: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  language: {
    type: String,
    default: true,
  },
  link: {
    type: String,
    default: true,
  },
  pages: {
    type: Number,
    default: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = bookSchema;