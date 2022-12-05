const bookSchema = require("../models/Book");

let Book
class BookDb {
  constructor(db) {
    Book = db.model("Book", bookSchema);
  }
}
