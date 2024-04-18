const Courses = require("../models/Courses");
const Enrollment = require("../models/Enrollment");
class CourseController {
  // GET /courses
  get(req, res, next) {
    const user = req.cookies.user;
    res.render("pages/category", { user });
  }
  //GET /courses/faculty/:faculty
  async getByFaculty(req, res, next) {
    const user = req.cookies.user;
    let faculty = req.params.faculty;
    await Courses.find({ faculty: faculty })
      .then((courses) => {
        const formattedSemesters = courses.map((course) => {
          const [firstValue, secondValue] = course.semester;
          return `${firstValue} - ${secondValue}`;
        });
        const distinctSemesters = [...new Set(formattedSemesters)];
        res.render("pages/categoryBySemester", {
          user,
          faculty,
          semesters: distinctSemesters,
        });
      })
      .catch(next);
  }
  // GET /courses/faculty/:faculty/:semester
  async getBySemester(req, res, next) {
    const user = req.cookies.user;
    let { faculty, semester } = req.params;
    let page = parseInt(req.query.page) || 1;
    const limit = 5;
    const totalCourses = await Courses.countDocuments({
      faculty,
      semester: { $all: [semester] },
    });
    const totalPages = Math.ceil(totalCourses / limit);
    await Courses.find({ faculty, semester: { $all: [semester] } })
      .sort({ updatedAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .then((courses) => {
        res.render("pages/courses", {
          courses,
          user,
          page,
          totalPages,
          faculty,
          semester,
        });
      })
      .catch(next);
  }
  // GET /courses/:slug
  async getCourse(req, res, next) {
    let user = req.cookies.user;
    await Courses.findOne({ slug: req.params.slug })
      .then((course) => {
        // console.log(course.faculty);
        res.render("pages/courseDetail", { user, course });
        // res.json(course);
      })
      .catch(next);
  }
  // GET /courses/create
  renderCreateForm(req, res, next) {
    res.render("pages/admin/create", { user: req.cookies.user });
  }
  // POST /courses/create
  async create(req, res, next) {
    const {
      c_id,
      faculty,
      name_en,
      name_vn,
      semester_en,
      semester_vn,
      description,
      teacher,
      image,
    } = req.body;
    let err = {};
    let formType = req.body.formType;
    if (formType === "cancel") {
      return res.redirect("/home");
    }
    if (formType === "create") {
      if (c_id === "" || c_id === undefined) {
        err.c_id = "This courses id is required!";
      }
      if (name_en === "" || name_en === undefined) {
        err.name_en = "This course name is required!";
      }
      if (name_vn === "" || name_vn === undefined) {
        err.name_vn = "This course name is required!";
      }
      if (semester_en === "" || semester_en === undefined) {
        err.semester_en = "This semester field is required!";
      }
      if (semester_vn === "" || semester_vn === undefined) {
        err.semester_vn = "This semester field is required!";
      }
      // if (code === "" || code === undefined) {
      //   err.code = "This code field is required!";
      // }
      if (Object.keys(err).length !== 0) {
        return res
          .status(400)
          .render("pages/admin/create", { err: err, user: req.cookies.user });
      }
      await Courses.findOne({ c_id, faculty })
        .then(async (existingCourse) => {
          if (existingCourse) {
            err.c_id = "This course has already existed!";
          }
          if (Object.keys(err).length > 0) {
            return res.status(400).render("pages/admin/create", {
              err: err,
              user: req.cookies.user,
            });
          }
          const newCourse = new Courses({
            c_id: c_id,
            faculty: faculty,
            name: [name_en, name_vn],
            semester: [semester_en, semester_vn],
            description: description,
            teacher_name: teacher,
            image: image,
          });
          await newCourse
            .save()
            .then(() => {
              return res.status(201).redirect("/home");
            })
            .catch(next);
        })
        .catch(next);
    }
  }
  // GET /courses/enroll/:slug
  async enrollCourse(req, res, next) {
    let user = req.cookies.user;
    let slug = req.params.slug;
    try {
      const enrollment = await Enrollment.findOne({ u_id: user._id, slug });
      if (enrollment) {
        return res.redirect(`/courses/${slug}`);
      } else {
        const course = await Courses.findOne({ slug });
        // return res.json(course);
        return res.render("pages/enrollment", { user, course });
      }
    } catch (e) {
      console.log(e);
    }
  }
  // POST /courses/enroll/:slug
  async handleEnrolment(req, res, next) {
    let { slug, semester, code } = req.body;
    let user = req.cookies.user;
    let err = {};
    // res.json(req.body);
    await Courses.findOne({ slug, code })
      .then(async (match) => {
        if (match) {
          const enrolment = new Enrollment({
            u_id: user._id,
            slug,
            semester,
          });
          await enrolment
            .save()
            .then(() => {
              return res.status(201).redirect("/home");
            })
            .catch(next);
        } else {
          const course = await Courses.findOne({ slug });
          err.code = "Enrolment key is not correct! Try again!";
          return res.render("pages/enrollment", { user, err, course });
          // res.send("Something wrongs");
        }
        // res.json(match);

        // res.send("Match with code");
      })
      .catch(next);
  }
  // get /courses/edit/:id
  async renderEditForm(req, res, next) {
    let user = req.cookies.user;
    await Courses.findById(req.params.id)
      .then((course) => {
        res.render("pages/admin/edit", { user, course });
      })
      .catch(next);
  }
  // POST /courses/edit/:id
  // async renderEditForm(req, res, next) {
  //   let user = req.cookies.user;
  //   await Courses.findById(req.body.courseId)
  //     .then((course) => {
  //       res.render("pages/admin/edit", { user, course });
  //     })
  //     .catch(next);
  // }
  // POST /courses/edit/:id
  async edit(req, res, next) {
    let err = {};
    let user = req.cookies.user;
    let course = await Courses.findById(req.params.id);
    let { name, semester } = req.body;
    console.log(name);
    if (name.includes(undefined) || name.includes("")) {
      err.name = "Please enter name of this course";
    }
    if (semester.includes(undefined) || semester.includes("")) {
      err.semester = "Please enter semester of this course";
    }
    if (Object.keys(err).length > 0) {
      res.render("pages/admin/edit", { user, course, err });
    }
    await Courses.findByIdAndUpdate({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/courses/"))
      // .then(() => res.send("update"))
      .catch(next);
  }
  // DELETE courses/:id
  async delete(req, res, next) {
    await Courses.deleteOne({ c_id: req.body.courseId })
      .then(() => res.redirect("/courses"))
      .catch(next);
  }
}
module.exports = new CourseController();
