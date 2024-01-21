function authenticateUser(req, res, next) {
    const user = req.cookies.user;
    if (user) {
        next();
    } else {
        res.redirect('/');
    }
}
module.exports = authenticateUser;