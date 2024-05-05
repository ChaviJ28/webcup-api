let express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/auth");

router.post("/new", middleware.authenticateToken, async (req, res) => {
    try {
        var db = require("../models/userBets")
        var participantDb = require("../models/participants")

        var participant = await participantDb.findOne({
            _id: req.body.participant
        });

        if (!participant) {
            return res.status(500).json({
                success: false,
                message: "Incorrect participantF!"
            });
        }

        newUserBet = new db({
            user: req.user._id,
            participant: req.body.participant,
            competition: participant.competition,
            amount: req.body.amount,
            payment_type: req.body.payment_type,
            payout_amount: req.body.payout_amount,
        });

        newUserBet.save();

        return res.status(200).json({
            success: true,
            data: newUserBet
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// router.get("/:param", middleware.authenticateToken, async (req, res) => {
//     try {
//         var db = require("../models/userBets");
//         var param = req.params.param;

//         if (!param) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Invalid Parameter!"
//             });
//         }

//         bet = await db.findOne({
//             _id: param
//         });

//         if (!bet) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Bet not found!"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: bet
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