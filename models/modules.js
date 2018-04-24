var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var modulesSchema = new Schema({
    course_code: {type: String, required: true},
    module_name: {type: String, required: true},
    module_code: {type: String, required: true},
    lecturer: {type: String},
    date_created: {type: Date, default: new Date()},
});

module.exports = mongoose.model('Module', modulesSchema);