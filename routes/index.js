const express = require("express");
const route = express();
const signupmodel = require("../models/signup");
const session = require("express-session");
const { isadmin, islogout } = require("../middleware/adminmiddleware");
const addbookmodel = require("../models/bookmodel");
const bookmodel = require("../models/bookmodel");
route.use(session({ secret: "hello123" }));
route.get("/", islogout, async (req, res) => {
  try {
    const bookdata = await bookmodel.find();
    res.render("home", { bookdata });
  } catch (err) {
    console.log(err.message);
  }
});
// all book
route.get("/books", islogout, async (req, res) => {
  try {
    const bookdata = await bookmodel.find();
    res.render("allbook", { bookdata });
  } catch (err) {
    console.log(err.message);
  }
});
// book fear
route.get("/books-2024", islogout, (req, res) => {
  try {
    res.render("bookfear");
  } catch (err) {
    console.log(err.message);
  }
});
// book fear
route.get("/book-information/:id", islogout, async (req, res) => {
  try {
    const matchbookdata = await bookmodel.findById({ _id: req.params.id });
    res.render("bookinfo", { matchbookdata });
  } catch (err) {
    console.log(err.message);
  }
});
// first year
route.get("/first-year-books", islogout, (req, res) => {
  try {
    res.render("firstybook");
  } catch (err) {
    console.log(err);
  }
});
// second year
route.get("/second-year-books", islogout, (req, res) => {
  try {
    res.render("secondybook");
  } catch (err) {
    console.log(err);
  }
});
// login
route.get("/login", islogout, (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
});
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const matchadmin = await signupmodel.findOne({ email: email });
    if (matchadmin) {
      if (matchadmin.password == password) {
        if (matchadmin.is_admin == 1) {
          req.session.admin_id = matchadmin;
          res.redirect("/admin");
        } else {
          res.redirect("/login");
        }
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
});
// logout
route.get("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
});
// contact
route.get("/contact", (req, res) => {
  try {
    res.render("contact");
  } catch (err) {
    console.log(err.message);
  }
});
// admin
route.get("/admin", isadmin, async (req, res) => {
  try {
    let searchinfo = "";
    if (req.query.searchbook) {
      searchinfo = req.query.searchbook;
    }
    const allbookinfo = await bookmodel.find({
      $or: [
        { book_name: { $regex: ".*" + searchinfo + ".*" } },
        { company_name: { $regex: ".*" + searchinfo + ".*" } },
        { class_name: { $regex: ".*" + searchinfo + ".*" } },
        { writter_name: { $regex: ".*" + searchinfo + ".*" } },
      ],
    });

    res.render("admin", { allbookinfo });
  } catch (err) {
    console.log(err.message);
  }
});
// delete book
route.get("/delete-book/:id", isadmin, async (req, res) => {
  try {
    await bookmodel.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/admin");
  } catch (err) {
    console.log(err.message);
  }
});
// update book
route.get("/update-book/:id", isadmin, async (req, res) => {
  try {
    const bookdata = await bookmodel.findById({ _id: req.params.id });
    res.render("updatebook", { bookdata });
  } catch (err) {
    console.log(err.message);
  }
});
route.post("/update-book/:id", isadmin, async (req, res) => {
  try {
    const bookdata = await bookmodel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          book_name: req.body.bookname,
          company_name: req.body.company,
          image: req.body.image,
          writter_name: req.body.writter,
          class_name: req.body.classname,
          book_year: req.body.bookyear,
          quantity: req.body.quantity,
        },
      }
    );
    res.redirect("/admin");
  } catch (err) {
    console.log(err.message);
  }
});
// admin
route.get("/add-book", isadmin, (req, res) => {
  try {
    res.render("addbook");
  } catch (err) {
    console.log(err.message);
  }
});
route.post("/add-book", (req, res) => {
  try {
    const addbookinfo = new addbookmodel({
      book_name: req.body.bookname,
      book_type: req.body.booktype,
      full_name: req.body.fullname,
      company_name: req.body.company,
      image: req.body.image,
      writter_name: req.body.writter,
      class_name: req.body.classname,
      book_year: req.body.bookyear,
      quantity: req.body.quantity,
    });
    addbookinfo.save();
    res.render("addbook");
  } catch (err) {
    console.log(err.message);
  }
});
// library
route.get("/library", isadmin, (req, res) => {
  try {
    res.render("library");
  } catch (err) {
    console.log(err.message);
  }
});
// library
route.get("/first-year", isadmin, (req, res) => {
  try {
    res.render("firstyear");
  } catch (err) {
    console.log(err.message);
  }
});
// library
route.get("/second-year", isadmin, (req, res) => {
  try {
    res.render("secondyear");
  } catch (err) {
    console.log(err.message);
  }
});
module.exports = route;
