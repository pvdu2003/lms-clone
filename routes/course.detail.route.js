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
  "/:slug/leave",
  authenticateUser,
  courseDetailController.leaveCourse
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
router.post(
  "/:slug/topic/:index/update-file/:fileIndex",
  upload.single("topicFile"),
  courseDetailController.updateFile
);
router.delete(
  "/:slug/topic/:index/delete-file/:fileIndex",
  courseDetailController.deleteFile
);
router.delete("/:slug/delete-topic/:index", courseDetailController.deleteTopic);
router.put("/:slug/update-topic/:id", courseDetailController.updateTopic);
router.get("/:slug", authenticateUser, courseDetailController.getCourse);
module.exports = router;
