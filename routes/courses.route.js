const express = require("express");
const router = express.Router();
const courseController = require("../app/controllers/course.controller");
const authenticateUser = require("../app/middlewares/authenticateUser");
const authorizeUser = require("../app/middlewares/authorizeUser");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/courseDetail"); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Set the file name to be unique
  },
});

const upload = multer({ storage });
router.get(
  "/create",
  authenticateUser,
  authorizeUser("admin"),
  courseController.renderCreateForm
);
router.post(
  "/create",
  authenticateUser,
  authorizeUser("admin"),
  courseController.create
);
router.get(
  "/edit/:id",
  authenticateUser,
  authorizeUser(["admin", "teacher"]),
  courseController.renderEditForm
);
router.post(
  "/edit/:id",
  authenticateUser,
  authorizeUser(["admin", "teacher"]),
  courseController.edit
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeUser("admin"),
  courseController.delete
);
router.get("/faculty/:faculty/:semester", courseController.getBySemester);
router.get("/faculty/:faculty", courseController.getByFaculty);
router.get("/enroll/:slug", authenticateUser, courseController.enrollCourse);
router.post(
  "/enroll/:slug",
  authenticateUser,
  courseController.handleEnrolment
);
router.get("/view/:slug/:topicIndex/:fileIndex", courseController.viewFile);
router.get(
  "/:slug/create-topic",
  authenticateUser,
  authorizeUser(["admin", "teacher"]),
  courseController.createNewTopic
);
router.post(
  "/:slug/file",
  authenticateUser,
  authorizeUser("admin, teacher"),
  upload.single("topicFile"),
  courseController.uploadFile
);
router.get("/:slug", authenticateUser, courseController.getCourse);
router.get("/", courseController.get);
module.exports = router;
