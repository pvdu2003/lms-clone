const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/user.controller');

router.get('/profile/:id', userController.userProfile);
router.get('/profile', userController.myProfile);
router.get('/getTeachers', userController.getTeachers);
router.get('/getStudents', userController.getStudents);
router.get('/showUser', userController.showUser);
router.post('/update-role', userController.updateRole);
router.post('/delete-user', userController.deleteUser);
router.post('/cancel-action', userController.cancelAction);


module.exports = router;