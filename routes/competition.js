let express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/auth");

let data = [];

router.post("/new", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/competition")

        newCompetition = new db({
            name: req.body.name,
            logo: req.body.logo,
        });

        newCompetition.save();

        return res.status(200).json({
            success: true,
            data: newCompetition
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
        var db = require("../models/competition");

        var competitions = await db.find({});

        return res.status(200).json({
            success: true,
            data: competitions
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
        var db = require("../models/competition");
        var participantDb = require("../models/participants");
        var param = req.params.param;

        if (!param) {
            return res.status(500).json({
                success: false,
                message: "Invalid Parameter!"
            });
        }

        var competition = await db.findOne({
            name: param
        });


        if (!competition) {
            competition = await db.findOne({
                _id: param
            });

            if (!competition) {
                return res.status(500).json({
                    success: false,
                    message: "Competition not found!"
                });
            }
        }

        var participants = await participantDb.find({
            competition: competition._id
        });

        var participantsArr = []

        for (let i = 0; i < participants.length; i++) {
            const x = participants[i];
            const [numerator, denominator] = x.odds.split('/');
            const numeric = parseInt(numerator) / parseInt(denominator);
            let level;

            if (numeric < 5) {
                level = "low";
            } else if (numeric >= 5 && numeric < 20) {
                level = "medium";
            } else {
                level = "high";
            }

            participantsArr.push({
                ...participants[i]._doc,
                odds: {
                    string: x.odds,
                    numeric,
                    level
                }
            })
        }

        var returnObj = {};
        if (Array.isArray(participants) && participants.length < 1) {
            returnObj = {
                ...competition._doc,
                participants: []
            }
        } else {
            returnObj = {
                ...competition._doc,
                participants: participantsArr
            }
        }

        return res.status(200).json({
            success: true,
            data: returnObj
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