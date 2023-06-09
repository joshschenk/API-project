const express = require('express');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const user = require('../../db/models/user');
const spotimage = require('../../db/models/spotimage');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {



    const spotImage = await SpotImage.findByPk(req.params.imageId,
        {
            include:
            [
            {
                model: Spot,
                where: {
                    ownerId: req.user.id
                }
            }

            ]
        })

    if (!spotImage) {
        const err = new Error("Spot Image couldn't be found")
        err.status = 404;
        return res.json({
            message: err.message
        })
    }

    await spotImage.destroy();

    return res.json({ message: "Successfully deleted" })


})

module.exports = router;
