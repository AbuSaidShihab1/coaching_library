const express = require("express");
const app = express();
const route = require("./routes/index");
const databsecon = require("./db/databasecon");
const bodyparser = require("body-parser");
// route
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(route);
databsecon();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.listen(5000, function () {
  console.log("Your website run on Port:");
});
