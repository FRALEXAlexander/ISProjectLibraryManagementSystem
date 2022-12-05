const router = require("express").Router();


class APIbook {
  constructor(db, authenticateJWT) {
    this.database = db;
    this.auth = authenticateJWT;
    this.setupAPI();
  }
  setupAPI() {
    router.get("/getAll", async (req, res) => {
      let books = await this.database.book.getAll();

      res.send({ status: "success", data: books });
      return;

      //console.log(user);
    });

    router.post("/add", async (req, res) => {
     
      //check if isbn is in use
      const isbnExists = await this.database.book.getByISBN(
        req.body.isbn
      );
      console.log(isbnExists)
      if (isbnExists)
        return res.send({ status: "error", reason: "isbn in use" });
     
      const book = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        imageLink: req.body.imageLink,
        language: req.body.language,
        link: req.body.link,
        pages: req.body.pages,
        status: req.body.status,
      };
      try {
        const savedBook = await this.database.book.add(book);
        res.send({ status: "success", data: savedBook });
      } catch (err) {
        res.status.send(err);
      }
    });
  }
  getRouter() {
    return router;
  }
}

module.exports = APIbook;
