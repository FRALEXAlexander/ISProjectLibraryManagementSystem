const fs = require("fs");
const express = require("express");
const cors = require("cors");

const https = require("https");
const http = require("http");
let backendRouter;

class web {
  constructor(br) {
    backendRouter = br;
    this.setupWeb();
  }
  setupWeb() {
    const app = express();

    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "localhost:3000"); // update to match the domain you will make the request from
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
    app.use(cors());
    var bodyParser = require("body-parser");
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.use("/", backendRouter);
    let port = 8080;
    if (process.env.NODE_ENV == "production") {
      // we will pass our 'app' to 'https' server
      https
        .createServer(
          {
            key: fs.readFileSync("./ssl/key.pem"),
            cert: fs.readFileSync("./ssl/cert.pem"),
          },
          app
        )
        .listen(port, () => {
          console.log(`Server running on port ${port} production`);
        });
    } else {
      app.listen(port, () => {
        console.log(`Server running on port ${port} local`);
      });
    }
  }
  getHTTP() {
    return http;
  }
}
module.exports = web;
