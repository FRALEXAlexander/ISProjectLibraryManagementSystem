const UserSchema = require("../models/User");

let User;
class UserDB {
  constructor(db) {
    User = db.model("User", UserSchema);
  }

  add = async function (data) {
    return await new Promise(function (resolve, reject) {
      let user = new User(data);
      user.save(function (err) {
        if (err) console.log(err);
        resolve(user);
      });
    });
  };
  getAll = async function () {
    return await new Promise(function (resolve, reject) {
      User.find({}, function (err, users) {
        resolve(users);
      });
    });
  };
  getByPublicKey = async function (publicKey) {
    return await new Promise(function (resolve, reject) {
      User.findOne({ publicKey: publicKey }, function (err, user) {
        resolve(user);
      });
    });
  };
  getByUsername = async function (username) {
    return await new Promise(function (resolve, reject) {
      User.findOne({ username: username }, function (err, user) {
        resolve(user);
      });
    });
  };
  getByPublicKey = async function (publicKey) {
    return await new Promise(function (resolve, reject) {
      User.findOne({ publicKey: publicKey }, function (err, user) {
        resolve(user);
      });
    });
  };
  getByID = async function (id) {
    return await new Promise(function (resolve, reject) {
      User.findOne({ _id: id }, function (err, user) {
        resolve(user);
      });
    });
  };
  getUsernameByID = async function (id) {
    return await new Promise(function (resolve, reject) {
      User.findOne({ _id: id }, function (err, user) {
        resolve(user.username);
      });
    });
  };
  changeNonce = async function (id, nonce) {
    return await new Promise(function (resolve, reject) {
      User.findOneAndUpdate(
        { _id: id },
        { $set: { nonce: nonce } },
        { upsert: true },
        function (err, doc) {
          if (err) console.log(err);
          resolve(doc);
        }
      );
    });
  };
  addLoginMethod = async function (id, method) {
    let user = await this.getByID(id);
    let loginMethods = user.loginMethods;

    loginMethods.push(method);

    return await new Promise(function (resolve, reject) {
      User.findOneAndUpdate(
        { _id: id },
        { $set: { loginMethods: loginMethods } },
        { upsert: true },
        function (err, doc) {
          if (err) console.log(err);
          resolve(doc);
        }
      );
    });
  };

  updateSetting = async function (publicKey, setting, value) {
    let settings = (await this.getByPublicKey(publicKey)).settings;
    settings[setting] = value;
    return await new Promise(function (resolve, reject) {
      User.findOneAndUpdate(
        { publicKey: publicKey },
        { $set: { settings: settings } },
        { upsert: true },
        function (err, user) {
          if (err) console.log(err);
          resolve(user);
        }
      );
    });
  };
}
module.exports = UserDB;
