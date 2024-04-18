const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;
const CourseSchema = new Schema(
  {
    _id: { type: objectId, auto: true },
    c_id: { type: String, required: true },
    faculty: { type: String, required: true },
    name: [{ type: String, required: true }],
    semester: [{ type: String, required: true }],
    teacher_name: [{ type: String, ref: "users" }],
    description: { type: String },
    code: {
      type: String,
      default: function () {
        return this.faculty.toUpperCase() + "#" + this.c_id.toUpperCase();
      },
    },
    image: { type: String },
    slug: { type: String, slug: ["c_id", "faculty"] },
    courseDetail: { type: Schema.Types.ObjectId, ref: "CourseDetail" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
mongoose.plugin(slug);
const Courses = mongoose.model("courses", CourseSchema);
module.exports = Courses;
