const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  f_title: {
    type: String,
    required: true,
  },
  f_description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const topicSchema = new Schema({
  t_title: {
    type: String,
    required: true,
  },
  files: [fileSchema],
});

const courseDetailSchema = new Schema({
  slug: {
    type: String,
    ref: "Courses",
    required: true,
  },
  topics: {
    type: [topicSchema],
    default: [
      { t_title: "Topic 1", files: [] },
      { t_title: "Topic 2", files: [] },
      { t_title: "Topic 3", files: [] },
    ],
  },
});

const CourseDetail = mongoose.model("course_detail", courseDetailSchema);
module.exports = CourseDetail;
