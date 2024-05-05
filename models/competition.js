const mongoose = require("mongoose");


var competitionSchema = mongoose.Schema({
    name: String,
    logo: String,
    created_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("competition", competitionSchema);