const mongoose = require("mongoose");
var bcrypt = require('bcrypt');


var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    wallet_address: String,
    country: String,
    phone_number: String,
    verfied: Boolean,
    created_at: { type: Date, default: Date.now() }
});

// hash the password
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("user", userSchema);