var mongoose = require('mongoose');
require('dotenv').config

var connection = mongoose.connect(process.env.MONGODB_URI);

exports.connection = connection;
