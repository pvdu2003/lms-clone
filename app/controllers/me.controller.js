const Courses = require("../models/Courses");
const Enrollment = require("../models/Enrollment");
class MeController {
  // GET /me/my-course
  async getMyCourse(req, res, next) {
    let user = req.cookies.user;
    await Enrollment.find({ u_id: user._id })
      .populate({
        path: "enrolledCourses._id",
        model: "courses",
        select: "slug", // Select the specific fields you want to populate
      })
      .then(async (enrollments) => {
        // console.log(enrollments);
        const slugs = enrollments
          .map((enrollment) =>
            enrollment.enrolledCourses.map((course) => course.slug)
          )
          .flat();

        const courses = await Courses.find({ slug: { $in: slugs } });
        res.render("pages/myCourse", { user, courses });
      })

      .catch((error) => {
        next(error);
      });
  }
  // GET /me/dashboard
  async getDashboard(req, res, next) {
    let user = req.cookies.user;
    await Enrollment.find({ u_id: user._id })
      .populate({
        path: "enrolledCourses._id",
        model: "courses",
        select: "slug", // Select the specific fields you want to populate
      })
      .then(async (enrollments) => {
        // console.log(enrollments);
        const slugs = enrollments
          .map((enrollment) =>
            enrollment.enrolledCourses.map((course) => course.slug)
          )
          .flat();

        const courses = await Courses.find({ slug: { $in: slugs } });

        res.render("pages/dashboard", { user, courses });
      })
      .catch(next);
  }
}
module.exports = new MeController();
