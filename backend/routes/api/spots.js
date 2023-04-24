const express = require('express');
const {Spot, SpotImage, Review, User, ReviewImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const user = require('../../db/models/user');
const spotimage = require('../../db/models/spotimage');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({
            min: 1,
            max: 5
        })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const validateCreate = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ max: 90, min: -90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ max: 180, min: -180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true }).isLength({ max: 50 })
        .notEmpty()
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Desciption is required'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Price per day is required'),
    handleValidationErrors,
];

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();

    let spotsList = [];

    for (let spot of spots) {
        let total = 0;
        const reviews = await spot.getReviews();
        const images = await spot.getSpotImages();


        // for (r of reviews) {
        //     total += r.dataValues.stars;
        // }

        // let previewImage = "";
        // for ( i of images)
        // {
        //     if (i.dataValues.preview)
        //         previewImage = i.dataValues.url

        // }
        previewImage = setPreview(images)



        // let avgRating = total / reviews.length
        // let spotJ = spot.toJSON();
        // spotJ.avgRating = avgRating
        // spotJ.previewImage = previewImage
        // spotsList.push(spotJ)
        //console.log(images)
        let spotJ = spot.toJSON();
        spotJ.avgRating = avgRating(reviews)
        spotJ.previewImage = previewImage
        spotsList.push(spotJ)
    }


    return res.json({Spots:spotsList});
})

router.get('/current', requireAuth, async (req, res, next) => {

    const user = req.user.id;
    const spots = await Spot.findAll({
        where: {
            ownerId: user
        },
        include: [
            {model: SpotImage},
            {model: Review}
        ]

    })
    let spotsList = []

    for (s of spots)
    {
        let spotJ = s.toJSON()
        console.log(spotJ)
        spotJ.avgRating = avgRating(spotJ.Reviews)
        spotJ.previewImage = setPreview(spotJ.SpotImages)

        delete spotJ.SpotImages;
        delete spotJ.Reviews;

        spotsList.push(spotJ)
    }
    // let spotsJ = spots[0].toJSON();
    // delete spotsJ.SpotImages
    // //console.log(spotsJ)

    res.json(spotsList)
})

router.get('/:spotId', async (req, res, next) => {

    let spotId = req.params.spotId
    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: [
            {
                model: SpotImage
            },
            {
                model: Review
            },
            {
                model: User,
                attributes:
                    [
                        'id', 'firstName', 'lastName'
                    ],
                as: 'Owner'

            }
        ]

    })

    if (!spot)
    {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })
    }

    let spotJ = spot.toJSON()
    spotJ.avgRating = avgRating(spotJ.Reviews)
    spotJ.previewImage = setPreview(spotJ.SpotImages)
    delete spotJ.Reviews

    res.json(spotJ)
})

router.post('/',requireAuth, validateCreate, async (req, res, next) => {
    const {address, city, state, country, lat, lng, name, description, price
        } = req.body;

    const ownerId = req.user.id;
    const spot = await Spot.create({
        ownerId, address, city, state, country, lat, lng, name, description, price
    })

    res.status(201);
    res.json(spot);


})

router.post('/:spotId/images', requireAuth, async (req, res, next) => {

    const spot = await Spot.findOne(
    {
        where:
        {
            id: req.params.spotId,
            ownerId: req.user.id

        }
    })


    if (!spot)
    {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })
    }

    const {url, preview} = req.body;

    const spotId = req.user.id
    const image = await SpotImage.create({spotId, url, preview} )


    res.json({id: image.id, url, preview})

})

router.put('/:spotId', requireAuth, validateCreate, async (req, res, next) => {

    const spot = await Spot.findOne(
        {
            where:
            {
                id: req.params.spotId,
                ownerId: req.user.id

            }
        })


    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })
    }

    const { address, city, state, country, lat, lng, name, description, price
    } = req.body;

    spot.set({address, city, state, country, lat, lng, name, description, price})

    await spot.save();

    return res.json(spot);
})


router.get('/:spotId/reviews', async (req, res, next) => {


    const spot = await Spot.findByPk(req.params.spotId,
    {

        include: [
            {
                model: Review,
                include: [
                    {
                        model: User,
                        attributes: [
                            'id', 'firstName', 'lastName'
                        ]
                    },
                    {
                        model: ReviewImage,
                        attributes: [
                            'id', 'url'
                        ],
                        required: false
                    }
                ]
            },


        ]

    })

    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })
    }
    res.json({Reviews: spot.Reviews});

})

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {

    const { review, stars} = req.body;

    const userId = req.user.id;
    const spotId = req.params.spotId

    const spot = await Spot.findOne(
    {
        where:
        {
            id: spotId

        },
        include:
        {
            model: Review
        }
    })

    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })
    }

    for (let r of spot.Reviews)
    {
        if (r.userId === userId)
        {
            const err = new Error("User already has a review for spot")
            err.status = 404;
            res.json({
                message: err.message
            })
        }
    }

    const rev = await Review.create({ userId, spotId, review, stars })


    res.status(201);
    res.json(rev);

})

router.delete('/:spotId', requireAuth, async (req, res, next) => {


    const spot = await Spot.findByPk(req.params.spotId,
        {
            where:
            {
                id: req.params.spotId,
                ownerId: req.user.id

            }
        })

    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })
    }

    await spot.destroy();

    return res.json({ message: "Successfully deleted" })

})
function setPreview(spotImages)
{
    let preview = ""
    for (image of spotImages) {
        if (image.preview)
            preview = image.url
    }

    return preview;
}

function avgRating(reviews)
{
    let total = 0;
    for (r of reviews) {
        total += r.stars;
    }

    let avgRating = total / reviews.length
    return avgRating;

}




module.exports = router;
