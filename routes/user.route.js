const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/user.controller");

router.get("/profile/:id", userController.userProfile);
router.get("/profile", userController.myProfile);
router.get("/change-password", userController.changePwd);
router.post("/change-password", userController.changePwdHandler);
router.get("/getTeachers", userController.getTeachers);
router.get("/getStudents", userController.getStudents);
router.get("/showUser", userController.showUser);
router.post("/update-role", userController.updateRole);
router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;
