const User = require('../models/User');
class userController {
    // for admin to see all profiles
    // GET user/profile/:id
    userProfile(req, res, next) {
        let user = req.cookies.user;
        let id = req.params.id;
        User.find({_id: id})
        .then((users) => {
            res.json(users);
        })
        .catch(next)
        // res.json(user);
    }
    // see user's profile only
    // GET user/profile 
    myProfile(req, res, next) {
        let user = req.cookies.user;
        User.find({_id: user._id})
        .then((user) => {
            res.json(user);
        })
        .catch(next)
        // res.json(user);
    }
    // GET /user/getTeachers
    getTeachers(req, res, next) {
        let user = req.cookies.user;
        User.find({role: "teacher"})
        .then((users) => {
            res.render('pages/users', {user, users});
            // res.json(users);
        })
        .catch(next);
    }
    // GET /user/getStudents
    getStudents(req, res, next) {
        let user = req.cookies.user;
        User.find({role: "student"})
        .then((users) => {
            res.render('pages/users', {user, users});
            // res.json(users);
        })
        .catch(next);
    }
    // GET /user/showUser
    showUser(req, res, next) {
        let user = req.cookies.user;
        User.find({})
        .then((users) => {
            res.render('pages/admin/showUser', {user, users})
            // res.json(users);
        })
        .catch(next);
    }
    // POST /user/update-role
    updateRole(req, res, next) {
        let user = req.cookies.user;
        let {_id, newRole} = req.body;
        User.findByIdAndUpdate(_id, {role: newRole}, {new: true})
        .then((user) =>{
            if(user){

                res.redirect('/user/showUser')
            }
            // res.render('pages/admin/showUser', {user})
        })
        .catch(next)
        // res.json({userId, newRole})
        // res.json(req.body);
        // res.send('Update');
    }
    deleteUser(req, res, next) {
        res.send('Delete');
    }
    cancelAction(req, res, next) {
        res.send('Cancel');

    }
}
module.exports = new userController();