const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;

const EnrollmentSchema = new Schema({
    _id: {type: objectId, auto: true},
    u_id: {type: objectId, ref: 'users'},
    c_id: {type: objectId, ref: 'courses'},
    semester: {type: String, ref: 'courses'},
}, {
    versionKey: false,
    timestamps: true
});
const Enrollment = mongoose.model('enrollments', EnrollmentSchema);
module.exports = Enrollment;