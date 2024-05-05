const mongoose = require("mongoose");
const participants = require("./participants");


var userBetsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "participants"
    },
    competition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "competition"
    },
    amount: String,
    payment_type: String,
    payout_amount: String,
    created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("userBets", userBetsSchema);