const mongoose = require("mongoose");


var participantSchema = mongoose.Schema({
    competition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "competition"
    },
    name: String,
    img_url: String,
    country: String,
    age: Number,
    odds: String,
    created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("participants", participantSchema);