const coursesRouter = require("./courses.route");
const homeRouter = require("./home.route");
const userRouter = require("./user.route");
const meRouter = require("./me.route");
const detailRouter = require("./course.detail.route");
const announcementRouter = require("./announcement.route");

function route(app) {
  app.use("/course", detailRouter);
  app.use("/announcement", announcementRouter);
  app.use("/courses", coursesRouter);
  app.use("/user", userRouter);
  app.use("/me", meRouter);
  app.use("/", homeRouter);
}

module.exports = route;
