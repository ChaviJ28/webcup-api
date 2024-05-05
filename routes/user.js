let express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/auth");

router.post("/new", middleware.authenticateToken, async (req, res) => {
    try {
        // return res.json({ email: req.body.email })
        var db = require("../models/user")
        // return db.find({
        //     email: req.body.email
        // });

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


router.get("/bets", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/userBets");
        var compDb = require("../models/competition");
        var partDb = require("../models/participants");
        var param = req.query.competition;
        var userBets;

        if (param) {
            userBets = await db.find({
                competition: param
            });
        } else {
            userBets = await db.find({});
        }

        if (!userBets) {
            return res.status(500).json({
                success: false,
                message: "Bets not found!"
            });
        }

        var betsArr = [];

        for (let i = 0; i < userBets.length; i++) {
            bet = userBets[i];
            if (!param) {
                competition = await compDb.findOne({
                    _id: bet.competition
                });
            } else {
                competition = param
            }

            participant = await partDb.findOne({
                _id: bet.participant
            });

            betsArr.push({
                ...bet._doc,
                participant: participant,
                competition
            })
        }

        return res.status(200).json({
            success: true,
            data: betsArr
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.get("/:param", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/user");
        var param = req.params.param;

        if (!param) {
            return res.status(500).json({
                success: false,
                message: "Invalid Parameter!"
            });
        }

        var user = await db.findOne({
            id: param
        });

        if (!user) {
            user = await db.findOne({
                email: param
            });

            if (!user) {
                return res.status(500).json({
                    success: false,
                    message: "User not found!"
                });
            }
        }

        delete user.password
        return res.status(200).json({
            success: true,
            data: user
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.get("/", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/user");
        var param = req.params.param;

        var user = await db.findOne({
            _id: req.user.id
        });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User not found!"
            });
        }

        delete user.password;
        return res.status(200).json({
            success: true,
            data: user
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.get("/bets", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/userBets");
        var compDb = require("../models/competition");
        var partDb = require("../models/participants");
        var param = req.query.competition;
        var userBets;

        if (param) {
            userBets = await db.findOne({
                competition: param
            });
        } else {
            userBets = await db.find({});
        }

        if (!userBets) {
            return res.status(500).json({
                success: false,
                message: "Bets not found!"
            });
        }

        var betsArr = [];

        userBets.forEach(async (bet) => {
            if (!param) {
                competition = await compDb.findOne({
                    competition: bet.competition
                });
            } else {
                competition = null
            }

            participant = await partDb.findOne({
                _id: bet.participant
            });

            betsArr.push({
                ...bet._doc,
                participant: participant,
                competition
            })


        });

        return res.status(200).json({
            success: true,
            data: betsArr
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