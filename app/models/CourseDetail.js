const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const fileSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const assignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

const topicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignments: [assignmentSchema],
  files: [fileSchema],
});

const courseDetailSchema = new Schema({
  courseId: {
    type: objectId,
    ref: "Courses",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  topics: [topicSchema],
});

const CourseDetail = mongoose.model("course_detail", courseDetailSchema);
module.exports = CourseDetail;
