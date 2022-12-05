const router = require("express").Router();

const ethUtil = require("ethereumjs-util");
const nacl = require("tweetnacl");
const bs58 = require("bs58");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  registerValidation,
  loginValidation,
} = require("../validation/authValidation");

class APIauth {
  constructor(db) {
    this.database = db;
    this.setupAPI();
  }
  rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  setupAPI() {
    router.post("/register", async (req, res) => {
      //Validation
      const { error } = registerValidation(req.body);
      if (error) return res.send(error.details[0].message);
    
      //check if username is in use
      const usernameExists = await this.database.user.getByUsername(
        req.body.username
      );
      if (usernameExists)
        return res.send({ status: "error", reason: "Username in use" });
      //Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      //Create User
      const user = {
        username: req.body.username,
        password: hashedPassword,
        roles: ["user"],
      };
      try {
        const savedUser = await this.database.user.add(user);
        res.send({ status: "success", data: savedUser });
      } catch (err) {
        res.status.send(err);
      }
    });

    router.post("/login", async (req, res) => {
      //Validation
      const { error } = loginValidation(req.body);
      if (error) return res.send(error.details[0].message);
      //check if user exists
      let user = await this.database.user.getByUsername(req.body.username);
      if (!user) return res.send("No user registered");
      
      //Check for correct password
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) return res.send("Invalid Password");
      //create token
      const access_token = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_TTL }
      );
      const refresh_token = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_TTL }
      );

      res.send({ access_token: access_token, refresh_token: refresh_token });
    });

    router.get("/me", async (req, res) => {
      try {
        const token = jwt.verify(
          req.header("Authorization").split(" ")[1],
          process.env.ACCESS_TOKEN_SECRET
        );
        console.log(token);
        const user = await this.database.user.getByID(token._id);
        res.send({ user: user });
      } catch (error) {
        //console.log(error);

        res.send({ error: "error" });
      }
    });

    router.post("/logout", async (req, res) => {
      console.log(req.body);
      res.send({ status: "success" });
    });

    router.post("/refresh", async (req, res) => {
      try {
        const refresh_token = jwt.verify(
          req.body.refresh_token,
          process.env.REFRESH_TOKEN_SECRET
        );

        const access_token = jwt.sign(
          { _id: refresh_token._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_TTL }
        );
        res.send({ access_token: access_token });
        console.log("refreshed token for " + refresh_token._id);
      } catch (error) {
        console.log("failed to refreshed token for " + refresh_token._id);
        res.send({ success: false });
      }
    });
  }
  getRouter() {
    return router;
  }
}

module.exports = APIauth;
