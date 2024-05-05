const mongoose = require("mongoose");


var adminSchema = mongoose.Schema({
    name: String,
    email: String,
    hash: String,
    salt: String,
    wallet_address: String,
    country: String,
    phone_number: String,
    verfied: Boolean,
    created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("admin", adminSchema);