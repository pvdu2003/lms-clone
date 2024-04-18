const Courses = require("../models/Courses");
const Enrollment = require("../models/Enrollment");
class MeController {
  // GET /me/my-course
  async getMyCourse(req, res, next) {
    let user = req.cookies.user;
    await Enrollment.find({ u_id: user._id })
      .then((enrollment) => {
        const courseSlugs = enrollment.map((enrollment) => enrollment.slug);
        return Courses.find({ slug: { $in: courseSlugs } });
      })
      .then((courses) => {
        res.render("pages/myCourse", { user, courses });
      })
      .catch(next);
  }
  // GET /me/dashboard
  async getDashboard(req, res, next) {
    let user = req.cookies.user;
    await Enrollment.find({ u_id: user._id })
      .then((enrollment) => {
        const courseSlugs = enrollment.map((enrollment) => enrollment.slug);
        return Courses.find({ slug: { $in: courseSlugs } });
      })
      .then((courses) => {
        res.render("pages/dashboard", { user, courses });
      })
      .catch(next);
  }
}
module.exports = new MeController();
