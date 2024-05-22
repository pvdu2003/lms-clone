const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const announcementSchema = new Schema(
  {
    _id: { type: objectId, auto: true },
    title: { type: String, required: true, unique: true },
    body: { type: String, required: true },
    files: [
      {
        path: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String },
      },
    ],
    createdBy: { type: String, ref: "users", required: true },
    updatedBy: { type: String, ref: "users" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Announcements = mongoose.model("announcements", announcementSchema);
module.exports = Announcements;
