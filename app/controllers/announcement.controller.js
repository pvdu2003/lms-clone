const path = require("path");
const Announcements = require("../models/Announcements");

class AnnouncementController {
  // POST /announcement/upload
  async uploadFile(req, res, next) {
    try {
      const user = req.cookies.user;
      const { title, body, createdBy } = req.body;
      const files = req.files;

      // Validate input fields
      let err = {};
      if (title.length === 0 || title === null) {
        err.title = "Please enter a title for this announcement!";
      }
      if (body.length === 0 || body === null) {
        err.body = "Please enter a body for this announcement!";
      }
      if (Object.keys(err).length > 0) {
        const announcements = await Announcements.find();

        return res.render("pages/home", { user, err, announcements });
      }

      // Handle file upload
      const fileDetails = files.map((file) => ({
        path: file.path,
        name: file.originalname,
      }));

      // Create a new announcement
      const announcement = new Announcements({
        title,
        body,
        createdBy,
        files: fileDetails,
      });

      // Save the announcement to the database
      await announcement.save();

      // Redirect to the homepage
      return res.redirect("/home");
    } catch (error) {
      // Handle errors
      next(error);
    }
  }
}
module.exports = new AnnouncementController();
