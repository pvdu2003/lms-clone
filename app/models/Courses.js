const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const CourseSchema = new Schema({
    _id: {type: objectId, auto: true},
    c_id: {type: String, required: true, unique: true},
    faculty: {type: String, required: true},
    name_en: {type: String, required: true},
    name_vn: {type: String, required: true},
    semester_en: {type: String, required: true},
    semester_vn: {type: String, required: true},
    description: {type: String},
    code: {type: String, required: true},
    image: {type: String},
    slug: {type: String, slug: ['c_id', 'faculty'], unique: true}
}, {
    versionKey: false,
    timestamps: true
});
mongoose.plugin(slug);
const Courses = mongoose.model('courses', CourseSchema);
module.exports = Courses;