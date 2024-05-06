// let express = require("express"),
//     router = express.Router(),
//     middleware = require("../middleware/auth");

// router.post("/new", middleware.authenticateToken, async (req, res) => {
//     try {
//         var db = require("../models/participants")

//         newParticipant = new db({
//             name: req.body.name,
//             img_url: req.body.img_url,
//             country: req.body.country,
//             age: req.body.age,
//             odds: req.body.odds,
//             competition: req.body.competition,
//         });

//         newParticipant.save();

//         return res.status(200).json({
//             success: true,
//             data: newParticipant
//         })

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             error: err.message
//         });
//     }
// });

// // router.get("/", middleware.authenticateToken, async (req, res) => {
// //     try {
// //         var db = require("../models/participants");

// //         var participants = await db.find({});

// //         return res.status(200).json({
// //             success: true,
// //             data: participants
// //         })

// //     } catch (err) {
// //         console.error(err);
// //         return res.status(500).json({
// //             success: false,
// //             error: err.message
// //         });
// //     }
// // });

// router.get("/:param", middleware.authenticateToken, async (req, res) => {
//     try {
//         var db = require("../models/participants");
//         var param = req.params.param;

//         if (!param) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Invalid Parameter!"
//             });
//         }

//         participant = await db.findOne({
//             _id: param
//         });

//         if (!participant) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Participant not found!"
//             });
//         }

//         const [numerator, denominator] = participant.odds.split('/');
//         const numeric = parseInt(numerator) / parseInt(denominator);
//         let level;

//         if (numeric < 5) {
//             level = "low";
//         } else if (numeric >= 5 && numeric < 20) {
//             level = "medium";
//         } else {
//             level = "high";
//         }



//         return res.status(200).json({
//             success: true,
//             data: {
//                 ...participant._doc,
//                 odds: {
//                     string: participant.odds,
//                     numeric,
//                     level
//                 }
//             }
//         })

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             error: err.message
//         });
//     }
// });

let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../config/database"));

const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    const payload = {
        id: user.id,
        email: user.email
    };

    const secret = 'webcup-debug-thugs';
    const options = { expiresIn: '24h' };

    return jwt.sign(payload, secret, options);
}

router.get("/", async (req, res) => {

    var sql =
        'SELECT * FROM participant;';


    connection.query(sql, async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ data: results });
    })
});


router.get("/:id", async (req, res) => {

    var sql =
        `SELECT * FROM participant WHERE id = ${req.params.id};`;


    connection.query(sql, async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ data: results });
    })
});

router.post("/new", async (req, res) => {
    const randomNumber = Math.floor(Math.random() * 1000) + 1;

    var sql =
        'INSERT INTO participant(id, name, age, country, odds, competition) VALUES (' + randomNumber + ', "' + req.body.name + '", "' + req.body.age + '", "' + req.body.country + '", "' + req.body.odds + '", "' + req.body.competition + '")';


    connection.query(sql, async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        return res.status(200).json({ data: results.insertId });

    })
});


module.exports = router;