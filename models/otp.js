const mongoose = require("mongoose");


var otpSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    otp: {
        type: String,
        default: () => Math.floor(100000 + Math.random() * 900000).toString(),
        unique: true
    },
    created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("otp", otpSchema);