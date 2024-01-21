const express = require('express');
const router = express.Router();
const courseController = require('../app/controllers/course.controller');
const authenticateUser = require('../app/middlewares/authenticateUser');
const authorizeUser = require('../app/middlewares/authorizeUser')

router.get('/create',authenticateUser, authorizeUser('admin'), courseController.renderCreateForm);
router.post('/create',authenticateUser, authorizeUser('admin'), courseController.create);
router.post('/edit/:id',authenticateUser, authorizeUser(['admin', 'teacher']), courseController.renderEditForm);
router.put('/edit/:id',authenticateUser, authorizeUser(['admin', 'teacher']), courseController.edit);
router.delete('/:id',authenticateUser, authorizeUser('admin'), courseController.delete);
router.get('/:slug',authenticateUser, courseController.get);
router.get('/', authenticateUser, courseController.showAll);
module.exports = router;