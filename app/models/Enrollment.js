const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const EnrollmentSchema = new Schema(
  {
    u_id: { type: objectId, ref: "users" },
    enrolledCourses: [
      {
        _id: { type: objectId, auto: true },
        slug: { type: String, ref: "courses" },
        semester: [{ type: String, ref: "courses" }],
        enrolledAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Enrollment = mongoose.model("enrollments", EnrollmentSchema);
module.exports = Enrollment;
