const router = require("express").Router();

const ethUtil = require('ethereumjs-util');
const nacl = require('tweetnacl')
const bs58 = require('bs58')


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
      //check if email is in use
      const publicKeyExists = await this.database.user.getByPublicKey(req.body.publicKey);
      if (publicKeyExists)
        return res.send({ status: "error", reason: "PublicKey in use" });
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
        publicKey: req.body.publicKey.toLowerCase(),
        password: hashedPassword,
        roles: ["user"],
        nonce: this.rnd(0, 999999),
        loginMethods: ["password"],

      };
      try {
        const savedUser = await this.database.user.add(user);
        res.send({ status: "success", data: savedUser });
      } catch (err) {
        res.status.send(err);
      }
    });

    router.post("/login", async (req, res) => {
      let publicKey = req.body.publicKey
      let signature = req.body.signature
      let user = await this.database.user.getByPublicKey(publicKey)
      console.log(publicKey + "  " + signature)
      switch (req.body.loginMethod) {
        case "password":

          //Validation
          const { error } = loginValidation(req.body);
          if (error) return res.send(error.details[0].message);
          //check if user exists

          if (!user) return res.send("No user registered");
          //Check if password login is enabled
          if (user.loginMethods.find(element => element == "password") == undefined) return res.send({ error: "Password login not enabled" })
          //Check for correct password
          const validPass = await bcrypt.compare(req.body.password, user.password);
          if (!validPass) return res.send("Invalid Password");
          //create token
          const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL });

          res.send({ access_token: token });
          break;
        case "metamask":
          console.log("metamask")




          console.log(user.nonce)
          let msg = `Login with nonce: ${user.nonce}`;

          msg = Buffer.from(msg, 'utf8').toString('hex')
          msg = ethUtil.addHexPrefix(msg)

          const msgBuffer = ethUtil.toBuffer(msg);
          const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
          const signatureBuffer = ethUtil.toBuffer(signature);
          const signatureParams = ethUtil.fromRpcSig(signatureBuffer);

          const publicKeyRec = ethUtil.ecrecover(
            msgHash,
            signatureParams.v,
            signatureParams.r,
            signatureParams.s
          );

          const addressBuffer = ethUtil.publicToAddress(publicKeyRec);
          const address = ethUtil.bufferToHex(addressBuffer);

          console.log(address)

          if (address == publicKey) {
            await this.database.user.changeNonce(user._id, this.rnd(0, 999999));

            const access_token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL });
            const refresh_token = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL });

            res.send({ access_token: access_token, refresh_token: refresh_token })
          } else {
            res.send("signature not correct")
          }
          break;
        case "phantom":



          const verified = nacl
            .sign
            .detached
            .verify(
              new TextEncoder().encode(`Login with nonce: ${user.nonce}`),
              bs58.decode(signature),
              bs58.decode(publicKey)
            )

          console.log(verified)

          if (verified) {
            await this.database.user.changeNonce(user._id, this.rnd(0, 999999));

            const access_token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL });
            const refresh_token = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL });

            res.send({ access_token: access_token, refresh_token: refresh_token })
          } else {
            res.send("signature not correct")
          }
          break;
        default:
          break;
      }


    });

    router.get("/nonce", async (req, res) => {
      console.log("NONCE")
      try {
        console.log(await this.database.user.getByPublicKey(req.query.publicKey))
        let user = await this.database.user.getByPublicKey(req.query.publicKey)
        if (user == null) {
          user = {
            publicKey: req.query.publicKey,
            loginMethods: [req.query.walletName],
            roles: ["user"],
            nonce: this.rnd(0, 999999)

          };
          await this.database.user.add(user)
        }

        // if (user.loginMethods.find(element => element == "metamask") == undefined) {

        //   console.log(await this.database.user.addLoginMethod(user._id, "metamask"))

        //   }

        console.log(user.nonce)
        res.send({ nonce: user.nonce });
      } catch (error) {
        //console.log(error);

        res.send({ error: "error" });
      }


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
        const refresh_token = jwt.verify(req.body.refresh_token
          , process.env.REFRESH_TOKEN_SECRET
        );

        const access_token = jwt.sign({ _id: refresh_token._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL });
        res.send({ access_token: access_token });
        console.log("refreshed token for " + refresh_token._id)
      } catch (error) {
        console.log("failed to refreshed token for " + refresh_token._id)
        res.send({ success: false });
      }

    });
  }
  getRouter() {
    return router;
  }
}

module.exports = APIauth;
