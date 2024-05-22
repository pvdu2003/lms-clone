const CourseDetail = require("../models/CourseDetail");
const Courses = require("../models/Courses");
const User = require("../models/User");

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

  // GET /courses/create
  async renderCreateForm(req, res, next) {
    const teachers = await User.find({ role: "teacher" });
    res.render("pages/admin/create", { user: req.cookies.user, teachers });
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
      return res.redirect("/");
    }
    if (formType === "create") {
      if (c_id === "" || c_id === undefined) {
        err.c_id = "This course id is required!";
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
      if (Object.keys(err).length !== 0) {
        return res.status(400).render("pages/admin/create", {
          err: err,
          user: req.cookies.user,
        });
      }

      try {
        const existingCourse = await Courses.findOne({ c_id, faculty });
        if (existingCourse) {
          err.c_id = "This course already exists!";
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

        const savedCourse = await newCourse.save();

        const courseDetail = new CourseDetail({
          slug: savedCourse.slug,
        });

        await courseDetail.save();

        savedCourse.courseDetail = courseDetail._id;
        await savedCourse.save();

        return res.status(201).redirect("/");
      } catch (error) {
        next(error);
      }
    }
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
  async edit(req, res, next) {
    let err = {};
    let user = req.cookies.user;
    let course = await Courses.findById(req.params.id);
    let { name, semester } = req.body;
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
