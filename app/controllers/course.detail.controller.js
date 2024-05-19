const CourseDetail = require("../models/CourseDetail");
const Courses = require("../models/Courses");
const Enrollment = require("../models/Enrollment");
const path = require("path");

class CourseDetailController {
  // GET /course/:slug
  async getCourse(req, res, next) {
    let user = req.cookies.user;
    let slug = req.params.slug;
    let edit = req.query.edit;
    await Courses.findOne({ slug })
      .then(async (course) => {
        const course_detail = await CourseDetail.findOne({ slug });
        if (course_detail) {
          return res.render("pages/courseDetail", {
            user,
            course,
            course_detail,
            edit,
            slug,
          });
        }
      })
      .catch(next);
  }
  // GET /course/enroll/:slug
  async enrollCourse(req, res, next) {
    try {
      const user = req.cookies.user;
      const slug = req.params.slug;

      let enrollment = await Enrollment.findOne({ u_id: user._id });

      if (!enrollment) {
        // Create a new enrollment record if it doesn't exist
        enrollment = new Enrollment({ u_id: user._id, enrolledCourses: [] });
      }

      const isEnrolled = enrollment.enrolledCourses.some(
        (course) => course.slug === slug
      );

      if (isEnrolled) {
        // User is already enrolled in the course
        return res.redirect(`/course/${slug}`);
      }

      const course = await Courses.findOne({ slug });
      if (!course) {
        // Course not found
        return res.status(404).send("Course not found");
      }

      const newEnrollment = {
        slug: course.slug,
        semester: course.semester,
      };

      enrollment.enrolledCourses.push(newEnrollment);
      await enrollment.save();

      return res.render("pages/enrollment", { user, course });
    } catch (error) {
      next(error);
    }
  }
  // POST /course/:slug/leave
  async leaveCourse(req, res, next) {
    let slug = req.params.slug;
    const user = req.cookies.user;
    try {
      const enroll = await Enrollment.findOne({ u_id: user._id });
      if (enroll) {
        const courseIndex = enroll.enrolledCourses.findIndex(
          (course) => course.slug === slug
        );
        if (courseIndex !== -1) {
          enroll.enrolledCourses.splice(courseIndex, 1);
          enroll.save(res.redirect("/"));
        } else {
          res.status(404).send("This course is not exist!");
        }
      } else {
        res.status(404).send("You haven't enrolled this course!");
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  // POST /courses/enroll/:slug
  async handleEnrolment(req, res, next) {
    try {
      const { slug, semester, code } = req.body;
      const user = req.cookies.user;
      const err = {};

      const course = await Courses.findOne({ slug, code });
      if (!course) {
        err.code = "Enrollment key is not correct! Try again!";
        return res.render("pages/enrollment", { user, err, course });
      }

      const enrollment = await Enrollment.findOne({ u_id: user._id });
      if (enrollment) {
        const isEnrolled = enrollment.enrolledCourses.some(
          (course) => course.slug === slug
        );

        if (isEnrolled) {
          // User is already enrolled in the course
          return res.redirect("/home");
        }

        enrollment.enrolledCourses.push({ slug, semester });
        await enrollment.save();
      } else {
        const newEnrollment = new Enrollment({
          u_id: user._id,
          enrolledCourses: [{ slug, semester }],
        });
        await newEnrollment.save();
      }

      return res.status(201).redirect("/home");
    } catch (error) {
      next(error);
    }
  }
  // GET /course/:slug/create-topic
  async createNewTopic(req, res, next) {
    let user = req.cookies.user;
    let slug = req.params.slug;
    res.render("pages/course/createTopic", { slug, user });
  }

  // POST /course/:slug/file
  async uploadFile(req, res, next) {
    const { slug } = req.params;
    const { topic, title, description } = req.body;
    const file = req.file;

    try {
      let courseDetail = await CourseDetail.findOne({ slug });

      if (!courseDetail) {
        // Create new CourseDetail if not found
        courseDetail = new CourseDetail({ slug });
      }

      const topicExists = courseDetail.topics.some((t) => t.t_title === topic);

      if (topicExists) {
        // Update existing topic
        const existingTopic = courseDetail.topics.find(
          (t) => t.t_title === topic
        );
        const fileExists = existingTopic.files.some((f) => f.f_title === title);

        if (fileExists) {
          return res.status(400).json({ error: "File already exists." });
        }
        const newFile = {
          f_title: title,
          f_description: description,
          url: file.path,
        };

        existingTopic.files.push(newFile);
      } else {
        // Create new topic
        const newTopic = {
          t_title: topic,
          files: [
            {
              f_title: title,
              f_description: description,
              url: file.path,
            },
          ],
        };

        courseDetail.topics.push(newTopic);
      }

      await courseDetail.save();
      res.status(200).redirect("/course/" + slug);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  //   GET /course/:slug/view/:topicIndex/:fileIndex"
  async viewFile(req, res) {
    const { slug, topicIndex, fileIndex } = req.params;
    try {
      const courseDetail = await CourseDetail.findOne({ slug });

      if (!courseDetail) {
        return res.status(404).json({ error: "Course not found" });
      }

      const topic = courseDetail.topics[topicIndex];
      const file = topic.files[fileIndex];

      const filePath = path.resolve(file.url);
      res.sendFile(filePath); // Sends the file to be displayed in the browser
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Put/Patch /course/:slug/topic/:index/update-file/:fileIndex
  async updateFile(req, res, next) {
    try {
      const { slug, index, fileIndex } = req.params;
      const { title, description } = req.body;
      const topicFile = req.file;
      console.log(topicFile);
      // Find the course detail document
      const courseDetail = await CourseDetail.findOne({ slug });

      courseDetail.topics[index].files[fileIndex].f_title = title;
      courseDetail.topics[index].files[fileIndex].f_description = description;

      // If a new file was uploaded, update the URL
      if (topicFile) {
        // Here, you would need to handle the file upload, e.g., using a file storage service
        // and update the 'url' field of the file accordingly
        courseDetail.topics[index].files[fileIndex].url = topicFile.path;
      }

      // Save the updated course detail document
      await courseDetail.save();

      res.redirect(`/course/${slug}`);
    } catch (error) {
      console.error("Error updating file detail:", error);
      res.status(500).send("Error updating file detail");
    }
  }
  // DELETE /course/:slug/topic/:index/delete-file/:fileIndex
  async deleteFile(req, res, next) {
    try {
      const { slug, index, fileIndex } = req.params;

      const courseDetail = await CourseDetail.findOne({ slug });
      courseDetail.topics[index].files.splice(fileIndex, 1);
      await courseDetail.save();
      res.redirect("/course/" + slug);
    } catch (e) {
      console.log(e);
      res.status(500).send("Fails to delete file");
    }
  }
  // DELETE /course/:slug/delete-topic/:index
  async deleteTopic(req, res, next) {
    try {
      const { slug, index } = req.params;

      // Find the course detail document
      const courseDetail = await CourseDetail.findOne({ slug });

      // Remove the topic from the course detail document
      courseDetail.topics.splice(index, 1);

      // Save the updated course detail document
      await courseDetail.save();

      // Redirect to the course page
      res.redirect(`/course/${slug}`);
    } catch (error) {
      console.error("Error deleting topic:", error);
      res.status(500).send("Error deleting topic");
    }
  }
}
module.exports = new CourseDetailController();
