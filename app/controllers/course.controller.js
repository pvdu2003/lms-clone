const Courses = require('../models/Courses');
const bcrypt = require('bcrypt');
class CourseController {
    // GET /courses
    async showAll(req, res, next) {
        const user = req.cookies.user;
        let page = parseInt(req.query.page) || 1
        const limit = 5
        const totalCourses = await Courses.countDocuments()
        const totalPages = Math.ceil(totalCourses / limit)
        await Courses.find()
            .sort({updatedAt: 'desc'})
            .skip((page - 1) * limit)
            .limit(limit)
            .then(courses => {
                res.render('pages/courses', {courses, user, page, totalPages});
            })
            .catch(next);
    }
    // GET /courses/:slug
    async get(req, res, next) {
        await Courses.find({slug: req.params.slug})
            .then(courses => {
                res.json(courses);
            })
            .catch(next);
    }
    // GET courses/create
    renderCreateForm(req, res, next) {
        res.render('pages/admin/create', {user: req.cookies.user});
    }
    // POST courses/create
    async create(req, res, next) {
        const {c_id, faculty, name_en, name_vn, semester_en, semester_vn, description, code, image} = req.body;
        let err = {};
        let formType = req.body.formType;
        if(formType === 'cancel') {
            return res.redirect('/home');
        }
        if (formType === 'create') {
            if(c_id === '' || c_id === undefined) {
                err.c_id = 'This courses id is required!';
            }
            if(name_en === '' || name_en === undefined) {
                err.name_en = 'This course name is required!';
            }
            if(name_vn === '' || name_vn === undefined) {
                err.name_vn = 'This course name is required!';
            }
            if(semester_en === '' || semester_en === undefined) {
                err.semester_en = 'This semester field is required!';
            }
            if(semester_vn === '' || semester_vn === undefined) {
                err.semester_vn = 'This semester field is required!';
            }
            if(code === '' || code === undefined) {
                err.code = 'This code field is required!';
            }
            if (Object.keys(err).length !== 0) {
                return res.status(400).render('pages/admin/create', {err: err, user: req.cookies.user});
            } 
            // res.json(req.body)
            await Courses.findOne({c_id})
            .then(async (existingCourse) => {
                if(existingCourse) {
                    err.message = 'This course has already existed!';
                } 
                if(Object.keys(err).length > 0) {
                    return res.status(400).render('pages/admin/create', {err: err, user: req.cookies.user});
                }            
                const newCourse = new Courses({
                    c_id: c_id,
                    faculty: faculty,
                    name_en: name_en,
                    name_vn: name_vn,
                    semester_en: semester_en,
                    semester_vn: semester_vn,
                    description: description,
                    code: code,
                    image: image
                })
                await newCourse.save()
                .then(() => {return res.status(201).redirect('/home')})
                .catch(next)
            })
            .catch(next);
        }   
    }
    // GET courses/edit/:id
    async renderEditForm(req, res, next) {
        let user = req.cookies.user
        await Courses.findById(req.body.courseId)
        .then((course) => {
            res.render('pages/admin/edit', {user, course })
        })
        .catch(next)
    }
    // PUT courses/edit/:id
    async edit(req, res, next) {
        await Courses.updateOne({_id: req.params.id}, req.body)
        .then(()=> res.redirect('/courses'))
        .catch(next);
    }
    // DELETE courses/:id
    async delete(req, res, next) {
        // res.json(req.body)
        await Courses.deleteOne({c_id: req.body.courseId})
        .then(()=> res.redirect('/courses'))
        .catch(next);
    }
}
module.exports = new CourseController();