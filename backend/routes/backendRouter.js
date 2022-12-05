let express = require("express");
const jwt = require("jsonwebtoken");
let router = express.Router();
let APIauth;
let APIuser;
let APIbook

class backendRouter {
  constructor(authAPI, userAPI,bookAPI) {
    APIauth = authAPI;
    APIuser = userAPI;
    APIbook = bookAPI;

    this.setupBackendRouter();
  }
  setupBackendRouter() {
    router.use("/auth", APIauth.getRouter());
    router.use("/user", APIuser.getRouter());
    router.use("/book", APIbook.getRouter());

    router.use(function timeLog(req, res, next) {
      console.log("Time: ", Date.now());
      next();
    });
  }
  getRouter() {
    return router;
  }
}
module.exports = backendRouter;
