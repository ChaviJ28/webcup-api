let express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/auth");

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
    try {
        var db = require("../models/user")
        var user = await db.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User not found!"
            });
        }

        if (!user.validPassword(req.body.password)) {
            return res.status(500).json({
                success: false,
                message: "Invalid Password!"
            });
        }
        const jwt = generateAccessToken(user);

        return res.status(200).json({
            success: true,
            data: {
                id: newUser.id,
                email: newUser.email,
                jwt
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });

    }
});

router.post("/register", async (req, res) => {
    try {
        var db = require("../models/user")
        newUser = new db({
            name: req.body.name,
            email: req.body.email,
            country: req.body.country,
            phone_number: req.body.phone_number,
            verfied: false
        });

        newUser.password = newUser.generateHash(req.body.password);
        newUser.save();

        return res.status(200).json({
            success: true,
            data: newUser
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post("/send-otp", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/otp");
        otp = new db({
            user: req.user.id,
        });
        otp.save();

        return res.status(200).json({
            success: true,
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post("/verify-otp", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/otp");
        var userdb = require("../models/user");
        otpRecord = await db.findOne({
            otp: req.body.otp,
            user: req.user.id
        });

        if (!otpRecord) {
            return res.status(500).json({
                success: false,
                message: "Invalid OTP!"
            });
        }

        await userdb.updateOne({
            _id: req.user.id
        }, {
            verfied: true
        });

        return res.status(200).json({
            success: true,
            message: "User Verified"
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


module.exports = router;