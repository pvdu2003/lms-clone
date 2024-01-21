function authorizeUser(roles) {
    return (req, res, next) => {
      const user = req.cookies.user;
      if (!roles.includes(user.role)) {
        return res.sendStatus(403); // Forbidden
      }
      next();
    };
}
module.exports = authorizeUser;