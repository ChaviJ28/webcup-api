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

router.post("/login", async (req, res) => {

    var sql =
        `SELECT * FROM user WHERE email='${req.body.email}';`;


    connection.query(sql, async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        console.log(sql);
        console.log(results);

        if (results.length > 0) {
            if (req.body.password == results[0].password) {
                res.status(200).json({ data: results[0] });
            } else {
                return res.status(500).json({ message: "Invalid Password" });
            }
        } else {
            return res.status(500).json({ message: "Invalid Credentials" });
        }
    })
});

router.post("/register", async (req, res) => {

    var sql =
        'INSERT INTO user(name, email, country, verified, password) VALUES ("' + req.body.name + '", "' + req.body.email + '", "", false, "' + req.body.password + '")';


    connection.query(sql, async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        return res.status(200).json({ data: results.insertId });

    })
});

// router.post("/send-otp", async (req, res) => {
//     try {
//         var db = require("../models/otp");
//         otp = new db({
//             user: req.user.id,
//         });
//         otp.save();

//         return res.status(200).json({
//             success: true,
//         })

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             error: err.message
//         });
//     }
// });

// router.post("/verify-otp", middleware.authenticateToken, async (req, res) => {
//     try {
//         var db = require("../models/otp");
//         var userdb = require("../models/user");
//         otpRecord = await db.findOne({
//             otp: req.body.otp,
//             user: req.user.id
//         });

//         if (!otpRecord) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Invalid OTP!"
//             });
//         }

//         await userdb.updateOne({
//             _id: req.user.id
//         }, {
//             verfied: true
//         });

//         return res.status(200).json({
//             success: true,
//             message: "User Verified"
//         })

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             error: err.message
//         });
//     }
// });


module.exports = router;