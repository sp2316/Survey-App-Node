const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/survey");

const db = mongoose.connection;

db.on("error", console.error.bind("Error connecting to database"));

db.once("open", () => {
  console.log("connected to database");
});

module.exports = db;
