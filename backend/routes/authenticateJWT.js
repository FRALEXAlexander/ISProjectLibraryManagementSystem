const jwt = require("jsonwebtoken");
let database;

class authenticateJWT {
  constructor(db) {
    database = db;

  }

  verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
      let rolesArray = [...allowedRoles];
      let result = req.user.roles.map(role => rolesArray.includes(role)).find(val => val === true)
      if(!result)return res.sendStatus(403);
      next();
    }
  }

  force = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = await database.user.getByID(user._id);
        next();
      });
    } else {
      res.sendStatus(401);
    }
  }

  forceAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = await database.user.getByID(user._id);

        if (!req.user.roles.includes("admin")) {
          return res.sendStatus(403);
        }

        next();
      });
    } else {
      res.sendStatus(401);
    }
  }

  isAuth = (req) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      let isValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return false
        } else {

          return true;
        }
      });
      return isValid
    } else {
      return false
    }
  }

  getUser = async (req) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      let isValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
          return false
        } else {

          return await database.user.getByID(user._id);
        }
      });
      return isValid
    } else {
      return false
    }
  }

  isAuthReq = async (req, user) => {
    if (req.user.roles.includes("admin")) return true
    return req.user._id.toString() == user._id.toString()
  }



}

module.exports = authenticateJWT;