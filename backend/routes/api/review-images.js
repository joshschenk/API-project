const express = require('express');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const user = require('../../db/models/user');
const spotimage = require('../../db/models/spotimage');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {



    const reviewImage = await ReviewImage.findByPk(req.params.imageId,
        {
            include:
                [
                    {
                        model: Review,
                        where: {
                            userId: req.user.id
                        }
                    }

                ]
        })

    if (!reviewImage) {
        const err = new Error("Review Image couldn't be found")
        err.status = 404;
        return res.json({
            message: err.message
        })
    }

    await reviewImage.destroy();

    return res.json({ message: "Successfully deleted" })


})

module.exports = router;
