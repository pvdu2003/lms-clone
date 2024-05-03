const express = require("express");
const router = express.Router();
const courseDetailController = require("../app/controllers/course.detail.controller");
const authenticateUser = require("../app/middlewares/authenticateUser");
const authorizeUser = require("../app/middlewares/authorizeUser");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/courseDetail"); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
router.get(
  "/:slug/enroll",
  authenticateUser,
  courseDetailController.enrollCourse
);
router.post(
  "/:slug/enroll",
  authenticateUser,
  courseDetailController.handleEnrolment
);
router.get(
  "/:slug/view/:topicIndex/:fileIndex",
  courseDetailController.viewFile
);
router.get(
  "/:slug/create-topic",
  authenticateUser,
  authorizeUser(["admin", "teacher"]),
  courseDetailController.createNewTopic
);
router.post(
  "/:slug/file",
  authenticateUser,
  authorizeUser("admin, teacher"),
  upload.single("topicFile"),
  courseDetailController.uploadFile
);
router.get("/:slug", authenticateUser, courseDetailController.getCourse);
module.exports = router;
