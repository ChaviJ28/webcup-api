let express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/auth");

router.post("/new", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/participants")

        newParticipant = new db({
            name: req.body.name,
            img_url: req.body.img_url,
            country: req.body.country,
            age: req.body.age,
            odds: req.body.odds,
            competition: req.body.competition,
        });

        newParticipant.save();

        return res.status(200).json({
            success: true,
            data: newParticipant
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// router.get("/", middleware.authenticateToken, async (req, res) => {
//     try {
//         var db = require("../models/participants");

//         var participants = await db.find({});

//         return res.status(200).json({
//             success: true,
//             data: participants
//         })

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             error: err.message
//         });
//     }
// });

router.get("/:param", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/participants");
        var param = req.params.param;

        if (!param) {
            return res.status(500).json({
                success: false,
                message: "Invalid Parameter!"
            });
        }

        participant = await db.findOne({
            _id: param
        });

        if (!participant) {
            return res.status(500).json({
                success: false,
                message: "Participant not found!"
            });
        }

        const [numerator, denominator] = participant.odds.split('/');
        const numeric = parseInt(numerator) / parseInt(denominator);
        let level;

        if (numeric < 5) {
            level = "low";
        } else if (numeric >= 5 && numeric < 20) {
            level = "medium";
        } else {
            level = "high";
        }



        return res.status(200).json({
            success: true,
            data: {
                ...participant._doc,
                odds: {
                    string: participant.odds,
                    numeric,
                    level
                }
            }
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