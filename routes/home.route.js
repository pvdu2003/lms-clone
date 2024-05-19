const express = require("express");
const router = express.Router();
const homeController = require("../app/controllers/home.controller");

router.get("/signin", homeController.renderSigninForm);
router.post("/signin", homeController.signin);
router.get("/logout", homeController.logout);
router.get("/", homeController.goHome);
router.post("/", homeController.login);

module.exports = router;
