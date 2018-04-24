var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
require('./util');

var usersSchema = new Schema({
    user_name: { type: String, required: true },
    password: { type: String, required: true },
    profile_pic: { type: String},
    access_token: { type: String },
});

/*
 * Hashes the password for storage in the DB
 */
usersSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Compares passwords to determine if the user is who they say they are
usersSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', usersSchema);