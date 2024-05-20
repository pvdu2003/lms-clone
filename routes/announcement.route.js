const express = require("express");
const router = express.Router();
const AnnouncementController = require("../app/controllers/announcement.controller");
const authorizeUser = require("../app/middlewares/authorizeUser");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/announcements"); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  authorizeUser("admin"),
  upload.array("topicFile", 10),
  AnnouncementController.uploadFile
);
router.put(
  "/update/:id",
  authorizeUser("admin"),
  upload.array("topicFile", 10),
  AnnouncementController.updateAnnouncement
);
router.delete(
  "/delete/:id",
  authorizeUser("admin"),
  AnnouncementController.deleteAnnouncement
);
module.exports = router;
