const bookSchema = require("../models/Book");

let Book
class BookDB {
  constructor(db) {
    Book = db.model("Book", bookSchema);
  }

  add = async function (data) {
    return await new Promise(function (resolve, reject) {
      let book = new Book(data);
      book.save(function (err) {
        if (err) console.log(err);
        resolve(book);
      });
    });
  };

  getAll = async function () {
    return await new Promise(function (resolve, reject) {
      Book.find({}, function (err, books) {
        resolve(books);
      });
    });
  };

  getByISBN = async function (isbn) {
    return await new Promise(function (resolve, reject) {
      Book.findOne({ isbn: isbn }, function (err, book) {
        resolve(book);
      });
    });
  };
}

module.exports = BookDB;