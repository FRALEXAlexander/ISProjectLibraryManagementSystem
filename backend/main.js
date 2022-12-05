if (process.env.NODE_ENV != "production") {
  process.env.DBURL = "144.91.124.180:27017";
  process.env.DBUSER = "isproject";
  process.env.DBPASS = "gommemode";
  process.env.ACCESS_TOKEN_SECRET = "dubistlost";
  process.env.REFRESH_TOKEN_SECRET = "dubistlost";
  process.env.ACCESS_TOKEN_TTL = "1h";
  process.env.REFRESH_TOKEN_TTL = "2d";
  process.env.CDNUrl = "https://cdn.fralex.at";
}

const Database = require("./database");
const UserDB = require("./database/user.js");
const BookDB = require("./database/book.js");
const hmdb = new Database(
  process.env.DBURL,
  process.env.DBUSER,
  process.env.DBPASS,
  "isproject"
);

hmdb.user = new UserDB(hmdb.getConn());
hmdb.book = new BookDB(hmdb.getConn());

const AuthenticateJWT = require("./routes/authenticateJWT");
const authenticateJWT = new AuthenticateJWT(hmdb);

const APIAuth = require("./routes/APIauth");
const APIauth = new APIAuth(hmdb);

const APIUser = require("./routes/APIuser");
const APIuser = new APIUser(hmdb, authenticateJWT);

const APIBook = require("./routes/APIbook");
const APIbook = new APIBook(hmdb, authenticateJWT);

const BackendRouter = require("./routes/backendRouter");
const backendRouter = new BackendRouter(APIauth, APIuser,APIbook);

const Web = require("./web");
new Web(backendRouter.getRouter());
