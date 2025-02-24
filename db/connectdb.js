(function (MongoDBConnection) {

  const mongoose = require("mongoose");
  const { MongoClient } = require('mongodb');
  var Q = require('q');

  // var credentials = require('../Config/credentials.js')

  var password = "newPass"
  var username = "DemoUser"
  var dbName = "NewInterviewTask"


  var uri = `mongodb+srv://${username}:${password}@cluster0.teccyhd.mongodb.net/${dbName}?retryWrites=true`
  mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("MongoDB Connected successfully");
    return db;
  });

  const getDB = () => {
    return db
  }


})(module.exports)