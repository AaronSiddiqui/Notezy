var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var postsSchema = new Schema({
  user_name: { type: String, required: true },
  module_code: { type: String, required: true },
  post_title: { type: String, required: true },
  post_content: { type: String, required: true },
  post_file: [{ type: String }],
  post_link: { type: String, required: true },
  date_created: { type: Date, default: new Date() },
  up_votes: { type: Number, default: 0 },
  down_votes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Post', postsSchema);