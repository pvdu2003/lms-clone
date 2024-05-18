const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Courses = require("../models/Courses");
const bcrypt = require("bcrypt");

class userController {
  // [GET] /user/change-password
  changePwd(req, res, next) {
    res.render("pages/changePwd");
  }
  // [POST] /user/change-password
  async changePwdHandler(req, res, next) {
    const user = req.cookies.user;
    let err = {};
    let { oldPwd, newPwd, confirmPwd } = req.body;
    if (oldPwd === undefined || oldPwd === "") {
      err.oldPwd = "Please enter current password";
    }
    if (newPwd === undefined || newPwd === "") {
      err.newPwd = "Please enter new password";
    }
    if (newPwd.length < 6) {
      err.newPwd = "Password must be more than 6 characters!";
    }
    if (confirmPwd === undefined || confirmPwd === "") {
      err.confirmPwd = "Please confirm new password again";
    }
    if (Object.keys(err).length > 0) {
      return res.render("pages/changePwd", { err });
    } else {
      await User.findById(user._id)
        .then((user) => {
          bcrypt
            .compare(oldPwd, user.password)
            .then((isMatch) => {
              if (!isMatch) {
                return res.status(400).send("Invalid password");
              }
              if (newPwd !== confirmPwd) {
                err.confirmPwd = "Please enter correct new password!";
                return res.render("pages/changePwd", { err });
              } else {
                bcrypt
                  .hash(newPwd, 10)
                  .then((hashedCode) => {
                    user.password = hashedCode;
                    return user.save();
                  })
                  .then(() => {
                    return res.render("pages/home");
                  })
                  .catch((error) => {
                    console.log(error);
                    return res.status(500).send("Internal error");
                  });
              }
            })
            .catch(next);
        })
        .catch(next);
    }
  }
  // for admin to see all profiles
  // GET /user/profile/:id
  async userProfile(req, res, next) {
    try {
      const user = req.cookies.user;
      const id = req.params.id;
      const usr = await User.findById(id);
      const enrollments = await Enrollment.find({ u_id: usr._id }).populate({
        path: "enrolledCourses._id",
        model: "courses",
        select: "slug",
      });

      const slugs = enrollments.reduce((acc, enrollment) => {
        acc.push(...enrollment.enrolledCourses.map((course) => course.slug));
        return acc;
      }, []);

      const courses = await Courses.find({ slug: { $in: slugs } });
      res.render("pages/profile", { usr, user, courses });
    } catch (error) {
      next(error);
    }
  }
  // see user's profile only
  // GET user/profile
  async myProfile(req, res, next) {
    try {
      const user = req.cookies.user;
      const usr = await User.findById(user._id);
      const enrollments = await Enrollment.find({ u_id: usr._id }).populate({
        path: "enrolledCourses._id",
        model: "courses",
        select: "slug",
      });

      const slugs = enrollments.reduce((acc, enrollment) => {
        acc.push(...enrollment.enrolledCourses.map((course) => course.slug));
        return acc;
      }, []);

      const courses = await Courses.find({ slug: { $in: slugs } });
      res.render("pages/profile", { usr, user, courses });
    } catch (error) {
      next(error);
    }
  }
  // GET /user/getTeachers
  async getTeachers(req, res, next) {
    let user = req.cookies.user;
    await User.find({ role: "teacher" })
      .then((users) => {
        res.render("pages/users", { user, users });
      })
      .catch(next);
  }
  // GET /user/getStudents
  async getStudents(req, res, next) {
    let user = req.cookies.user;
    await User.find({ role: "student" })
      .then((users) => {
        res.render("pages/users", { user, users });
      })
      .catch(next);
  }
  // GET /user/showUser
  async showUser(req, res, next) {
    let user = req.cookies.user;
    await User.find({})
      .then((users) => {
        res.render("pages/admin/showUser", { user, users });
      })
      .catch(next);
  }
  // POST /user/update-role
  async updateRole(req, res, next) {
    let user = req.cookies.user;
    let { _id, newRole } = req.body;
    await User.findByIdAndUpdate(_id, { role: newRole }, { new: true })
      .then((user) => {
        if (user) {
          res.redirect("/user/showUser");
        }
        // res.render('pages/admin/showUser', {user})
      })
      .catch(next);
  }
  // DELETE /user/delete-user/:id
  async deleteUser(req, res, next) {
    let id = req.params.id;
    await User.findByIdAndDelete(id)
      .then((user) => res.redirect("/user/showUser"))
      .catch(next);
  }
}
module.exports = new userController();
