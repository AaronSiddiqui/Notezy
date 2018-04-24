var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var coursesSchema = new Schema({
    college_abbreviation: {type: String, require: true},
    course_name: {type: String, required: true},
    course_code: {type: String, required: true},
    course_leader: {type: String},
    date_created: {type: Date, default: new Date()},
});

module.exports = mongoose.model('Course', coursesSchema);