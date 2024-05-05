var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var methodOverride = require('method-override');
require('dotenv').config();
const jwt = require('jsonwebtoken');

app.use(bodyparser.json())
    .use(bodyparser.urlencoded({
        extended: true
    }));
const mongoose = require("./config/database.js");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const competitionRoutes = require("./routes/competition");
const participantRoutes = require("./routes/participants");
const betRoutes = require("./routes/bet");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/competition", competitionRoutes);
app.use("/api/participant", participantRoutes);
app.use("/api/bet", betRoutes);

app.get('/', (req, res) => {
    res.send("Ok")
});

app.get('*', (req, res) => {
    res.status(404).send("Not Found")
});

port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('listening on port ' + port)
})