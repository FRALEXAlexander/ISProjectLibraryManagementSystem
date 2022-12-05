const router = require("express").Router();
let database;

class APIuser {
  constructor(db, authenticateJWT) {
    database = db;
    this.auth = authenticateJWT
    this.setupAPI();
  }
  setupAPI() {
    router.get("/getByPublicKey", this.auth.force, async (req, res) => {
      if (req.query.publicKey != undefined) {
        let user = await database.user.getByPublicKey(req.query.publicKey.toLowerCase());
        if (user == null) {
          res.send({ status: "error", data: "user does not exist" });
          return;
        }

        res.send({ status: "success", data: user });
        return;
      }


      res.send({ status: "error", data: "no publicKey in query" });

      //console.log(user);
    });
    router.get("/getAllUsers", this.auth.forceAdmin, async (req, res) => {

      let user = await database.user.getAll();


      res.send({ status: "success", data: user });
      return;




      //console.log(user);
    });

    //, this.auth.verifyRoles("admin")

    router.get("/updateSetting", this.auth.force, async (req, res) => {
      let user = await database.user.updateSetting(req.user.publicKey, req.query.setting, req.query.value);
      res.send({ status: "success", data: user.settings });
      return;
    });
  }
  getRouter() {
    return router;
  }
}

module.exports = APIuser;
