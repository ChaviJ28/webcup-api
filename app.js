var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mysql = require("mysql");
var methodOverride = require('method-override');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');
var nodemailer = require('nodemailer');

const options = {
    origin: 'http://localhost:3000',
}

app.use(cors())

app.use(bodyparser.json())
    .use(bodyparser.urlencoded({
        extended: true
    }));

let connection = mysql.createConnection(require('./config/database.js'));
connection.connect(function (err) {
    if (err) {
        return console.error("error: " + err.message);
    }
    console.log("Connected to the MySQL server.");
});
// const mongoose = require("./config/database.js");

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

app.post('/api/participant/bets', (req, res) => {
    // email, participant, amt, payOut

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API);


    const data = {
        text: `Hello, ${req.body.email}, you have successfully placed a bet of ${req.body.paymentType} ${req.body.amount} on participant ${req.body.participant}, with an expected Payout of ${req.body.payOut}`,
        emails: [
            req.body.email,
        ]
    };

    const msg = {
        to: req.body.email, // recipient's email address
        from: 'info@gmail.com',   // sender's email address
        subject: 'Mars Olympics 2092', // email subject
        text: `Hello, ${req.body.email}, you have successfully placed a bet of ${req.body.paymentType} ${req.body.amount} on participant ${req.body.participant}, with an expected Payout of ${req.body.payOut}`,
        // text: 'This is a test email sent from Node.js with SendGrid.', // plain text body
        // html: '<p>This is a test email sent from <b>Node.js</b> with <i>SendGrid</i>.</p>', // HTML body
    };

    // Send the email
    sgMail.send(msg)
        .then(() => {
            console.log('Email sent successfully');
        })
        .catch(error => {
            console.error('Error sending email:', error);
        });

    // const request = {
    //     url: "/v3/marketing/test/send_email",
    //     method: 'POST',
    //     body: data
    // }

    // client.request(request)
    //     .then(([response, body]) => {
    //         console.log(response.statusCode);
    //         console.log(response.body);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
    res.json("ok");
})

app.get('*', (req, res) => {
    res.status(404).send("Not Found")
});

port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('listening on port ' + port)
})