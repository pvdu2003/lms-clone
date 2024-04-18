const express = require("express");
const router = express.Router();
const meController = require("../app/controllers/me.controller");
router.get("/my-course", meController.getMyCourse);
router.get("/dashboard", meController.getDashboard);
module.exports = router;
