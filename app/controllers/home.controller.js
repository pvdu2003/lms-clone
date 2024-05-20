const Announcements = require("../models/Announcements");
const User = require("../models/User");
const bcrypt = require("bcrypt");
class HomeController {
  // POST /
  login(req, res, next) {
    const { username, password } = req.body;
    let err = {};
    if (username === undefined || username === "") {
      err.username = "Please enter your username";
    }
    if (!password) {
      err.password = "Please enter your password";
    }
    if (Object.keys(err).length > 0) {
      return res.render("pages/login", { err });
    }
    User.findOne({ username })
      .then((existingUser) => {
        if (!existingUser) {
          err.username = "This username is not existing!";
          return res.render("pages/login", { err });
        } else {
          bcrypt
            .compare(password, existingUser.password)
            .then((match) => {
              if (match) {
                res.cookie("user", existingUser, { maxAge: 1800000 });
                res.redirect("/");
              } else {
                err.password = "This password is not correct!";
                res.render("pages/login", { err });
              }
            })
            .catch(next);
        }
      })
      .catch(next);
  }
  // POST /logout
  logout(req, res, next) {
    res.clearCookie("user");
    res.redirect("/");
  }
  // GET /
  async goHome(req, res, next) {
    try {
      const user = req.cookies.user;
      const announcements = await Announcements.find()
        .sort({
          updatedAt: -1,
        })
        .limit(10);
      res.render("pages/home", { user, announcements });
    } catch (error) {
      next(error);
    }
  }
  renderSigninForm(req, res) {
    res.render("pages/signin");
  }
  // POST /sigin
  signin(req, res, next) {
    const { username, fname, password, confirmPw, role } = req.body;
    let err = {};
    if (username === undefined || username === "") {
      err.username = "Please enter your username";
    }
    if (fname === undefined || fname === "") {
      err.fname = "Please enter your full name";
    }
    if (password === undefined || password === "") {
      err.password = "Please enter your password";
    }
    if (confirmPw === undefined || confirmPw === "") {
      err.confirmPw = "Please enter your password again";
    }
    if (Object.keys(err).length === 0) {
      User.findOne({ username })
        .then((existingUser) => {
          if (existingUser) {
            err.username = "This username has already existed!";
          }
          if (password.length <= 6) {
            err.password = "This password is too short!";
          }
          if (password !== confirmPw) {
            err.confirmPw =
              "This password is not match with the previous password above!";
          }
          if (Object.keys(err).length > 0) {
            res.render("pages/signin", { err });
          }
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const newUser = new User({
                username: username,
                name: fname,
                password: hashedPassword,
                role: role,
              });
              return newUser.save();
            })
            .then(() => {
              return res.redirect("/");
            })
            .catch(next);
        })
        .catch(next);
    } else {
      return res.status(400).render("pages/signin", { err });
    }
  }
}
module.exports = new HomeController();
