const express = require('express');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const user = require('../../db/models/user');
const spotimage = require('../../db/models/spotimage');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const reviewimage = require('../../db/models/reviewimage');

const router = express.Router();


const validateRev = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({
            min:1,
            max:5
        })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.get('/current', requireAuth, async (req, res, next) => {

    const reviews = await Review.findAll(
        {
            where:
            {
                userId: req.user.id

            },
            include: [
                {
                    model: User,
                    // attributes:
                    // {
                    //     exlude:
                    //         [
                    //             'userName'
                    //         ]
                    // },
                },
                {
                    model: Spot,
                    // attributes:
                    // {
                    //     exlude:
                    //         [
                    //             'createdAt', 'updatedAt'
                    //         ]
                    // },
                    include: [
                        {
                            model: SpotImage,
                        }
                    ]
                },
                {
                    model: ReviewImage,
                    // attributes:
                    // {
                    //     exlude:
                    //         [
                    //             'createdAt', 'updatedAt'
                    //         ]
                    // },
                    required: false
                }
            ]
        })


        let reviewsList = [];

        for (r of reviews)
        {
            rev = r.toJSON();
            rev.Spot.previewImage = setPreview(rev.Spot.SpotImages)
            //setPreview(rev.SpotImage)
            delete rev.Spot.SpotImages
            delete rev.Spot.createdAt
            delete rev.Spot.updatedAt
            delete rev.User.username

            for (rI of rev.ReviewImages)
            {
                delete rI.updatedAt;
                delete rI.createdAt;
                delete rI.reviewId;
            }

            reviewsList.push(rev);

        }



        res.json({Reviews: reviewsList})

})


router.post('/:reviewId/images', requireAuth, async (req, res, next) => {

    const { url } = req.body;
    const reviewId = req.params.reviewId

    const review = await Review.findByPk(req.params.reviewId,
        {
            include: {
                model: ReviewImage
            }
        })

    if (!review) {
        const err = new Error("Review couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })
    }

    if (review.ReviewImages.length >= 10) {
        const err = new Error("Maximum number of images for this resource was reached")
        err.status = 403;
        res.json({
            message: err.message
        })
    }


    const rI = await ReviewImage.create({reviewId, url  })
    res.json({id:rI.id, url })

})

router.put('/:reviewId', requireAuth, validateRev,  async (req, res, next) => {

    const {review, stars} = req.body;

    const rev = await Review.findOne(
        {
            where:
            {
                id: req.params.reviewId,
                userId: req.user.id

            }
        })

    if (!rev) {
        const err = new Error("Review couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })
    }

    rev.set({ review, stars })

    await rev.save();

    //req.user.id

    res.json(rev)

})

router.delete('/:spotId', requireAuth, async (req, res, next) => {


    const review = await Spot.findByPk(req.params.spotId,
        {
            where:
            {
                id: req.params.spotId,
                userId: req.user.id

            }
        })

    if (!review) {
        const err = new Error("Review couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })
    }

    await review.destroy();

    return res.json({ message: "Successfully deleted" })

})

function avgRating(reviews) {
    let total = 0;
    for (r of reviews) {
        total += r.stars;
    }

    let avgRating = total / reviews.length
    return avgRating;

}

function setPreview(spotImages) {
    let preview = ""
    for (image of spotImages) {
        if (image.preview)
            preview = image.url
    }

    return preview;
}

module.exports = router;
