const mongoose = require("mongoose");

class database {

   

  constructor(DBURL,DBUSER,DBPASS,DB) {
    this.db = mongoose.createConnection(
      "mongodb://" + DBURL + "/"+DB+"?authSource=admin",
      {
        user: DBUSER,
        pass: DBPASS,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    mongoose.set("useFindAndModify", false);
    this.db.on("error", console.error.bind(console, "connection error:"));
    this.db.once("open", function () {
      console.log("connected to database "+DB);
    });
  }

  getConn(){
    return this.db;
  }

}
module.exports = database;
