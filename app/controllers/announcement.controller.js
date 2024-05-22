const path = require("path");
const Announcements = require("../models/Announcements");

class AnnouncementController {
  // GET /announcement/list
  async getAll(req, res, next) {
    try {
      const user = req.cookies.user;
      const announcements = await Announcements.find();
      res.render("pages/announcements", { user, announcements });
    } catch (e) {
      console.log(e);
      res.status(500).send("Internal server error");
    }
  }
  // GET /announcement/:id
  async getById(req, res, next) {
    try {
      const user = req.cookies.user;
      const id = req.params.id;
      const announcement = await Announcements.findById(id);
      res.render("pages/announcement", { user, announcement });

      // res.json(announcement);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  }
  // POST /announcement/upload
  async uploadFile(req, res, next) {
    try {
      const user = req.cookies.user;
      const { title, body, createdBy } = req.body;
      const files = req.files;

      // Validate input fields
      let err = {};
      if (title.length === 0 || title === null) {
        err.title = "Please enter title for this announcement!";
      }
      if (body.length === 0 || body === null) {
        err.body = "Please enter body for this announcement!";
      }
      const announcements = await Announcements.find()
        .sort({
          updatedAt: -1,
        })
        .limit(2);
      const numAnnounce = await Announcements.countDocuments();
      if (Object.keys(err).length > 0) {
        return res.render("pages/home", {
          user,
          err,
          announcements,
          numAnnounce,
        });
      }
      const prevTitle = await Announcements.find({ title: title });
      if (prevTitle === title) {
        err.title = "This title is already exist!";
        return res.render("pages/home", {
          user,
          err,
          announcements,
          numAnnounce,
        });
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
      return res.redirect("/");
    } catch (error) {
      // Handle errors
      next(error);
    }
  }

  // PUT/PATCH /announcement/update/:id
  async updateAnnouncement(req, res, next) {
    const user = req.cookies.user;
    try {
      const { id } = req.params;
      const { title, body, updatedBy } = req.body;
      const files = req.files;
      // Find the announcement to update
      const announcement = await Announcements.findById(id);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }

      // Update the announcement
      announcement.title = title;
      announcement.body = body;
      announcement.updatedBy = updatedBy;

      // Handle file updates
      if (files) {
        // Remove existing files
        announcement.files = [];

        // Add new files
        for (const file of files) {
          announcement.files.push({
            path: file.path,
            name: file.originalname,
          });
        }
      }

      await announcement.save();
      res.redirect("/");
      // return res.status(200).json(announcement);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  // DELETE /announcement/delete/:id
  async deleteAnnouncement(req, res, next) {
    try {
      const id = req.params.id;
      await Announcements.findByIdAndDelete(id);
      return res.redirect("/");
    } catch (e) {
      console.log(e);
      res.status(500).send("Internal server error");
    }
  }
}
module.exports = new AnnouncementController();
