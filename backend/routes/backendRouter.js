let express = require("express");
const jwt = require("jsonwebtoken");
let router = express.Router();
let APIauth;
let APIuser;

class backendRouter {
  constructor(authAPI, userAPI) {
    APIauth = authAPI;
    APIuser = userAPI;

    this.setupBackendRouter();
  }
  setupBackendRouter() {
    router.use("/auth", APIauth.getRouter());
    router.use("/user", APIuser.getRouter());

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
