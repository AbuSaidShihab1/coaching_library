const mongoose = require("mongoose");

const databsecon = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/library", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("Databse connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = databsecon;
