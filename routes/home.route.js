const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/home.controller');
const authenticateUser = require('../app/middlewares/authenticateUser');

router.get('/signin', homeController.renderSigninForm);
router.post('/signin', homeController.signin);
router.get('/home', authenticateUser,  homeController.goHome);
router.get('/logout', homeController.logout);
router.get('/', homeController.renderLoginForm);
router.post('/', homeController.login);


module.exports = router;