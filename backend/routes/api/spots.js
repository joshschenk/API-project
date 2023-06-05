const express = require('express');
const {Spot,Booking, SpotImage, Review, User, ReviewImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const user = require('../../db/models/user');
const spotimage = require('../../db/models/spotimage');
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
//const { query } = require('express-validator/check');
const router = express.Router();

const validateBooking =
[

    check('startDate')
        .exists({ checkFalsy: true })
        .notEmpty()
        .custom((value, {req}) => {
             let sD = new Date(req.body.startDate)
             let eD = new Date(req.body.endDate)
            return sD < eD

        })
        .withMessage('endDate cannot be on or before startDate'),
        handleValidationErrors

]

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
        .isLength({ max: 10 })

        .withMessage('Name must be less than 50 characters'),

    check('name')
        .exists({ checkFalsy: true }).notEmpty().withMessage("Name is required"),
    check('description')
        .exists({ checkFalsy: true }).isLength({min: 30})
        .withMessage('Desciption needs at least 30 characters'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Price per day is required'),
    handleValidationErrors,
];

const validateQuery = [
    query('page')
        .exists({ checkFalsy: true })
        .isInt({min: 1, max: 10})
        .withMessage("Page must be greater than or equal to 1",),
    query('size')
        .exists({ checkFalsy: true })
        .isInt({min:1, max:20})
        .withMessage("Size must be greater than or equal to 1",),
    query('maxLat')
        .if(query('maxLat').exists()) .isFloat({ max: 90 })
        .withMessage('Maximum latitude is not valid'),
     query('minLat')
         .if(query('minLat').exists()).isFloat({  min: -90 })
        .withMessage('Minimum latitude is not valid'),
    query('minLng')
        .if(query('minLng').exists()).isFloat({  min: -180 })
        .withMessage('Minimum longitude is not valid'),
    query('maxLng')
        .if(query('maxLng').exists()).isFloat({ max: 180 })
        .withMessage('Maximum longitude is not valid'),
    query('minPrice')
        .if(query('minPrice').exists()).isFloat({min: 0})
        .withMessage("Minimum price must be greater than or equal to 0",),
    query('maxPrice')
        .if(query('maxPrice').exists()).isFloat({min:0})
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors,
]

router.get('/',validateQuery, async (req, res, next) => {

    let {page, size, minLat, maxLat,
        minLng, maxLng, minPrice, maxPrice} = req.query

    page = parseInt(page);
    size = parseInt(size);

    let spotsList = [];


    const pagination = {};

    pagination.limit = size;
    pagination.offset = size * (page - 1);

    let where = {}

    if (minLat)
        where.lat = { [Op.gte]:minLat}

    if (maxLat)
        where.lat = { [Op.lte]:maxLat}

    if (minLng)
        where.lng =  {
        [Op.gte]: minLng
    }
    if (maxLng)
        where.lng =  {
        [Op.lte]: maxLng
    }
    if (minPrice)
        where.price = { [Op.gte]: minPrice }
    if (maxPrice)
        where.price = { [Op.lte] :maxPrice}

    const spots = await Spot.findAll({
        where,
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
             ...pagination


    }
    );


    for (let spot of spots) {
        let total = 0;
        // const reviews = await spot.getReviews();
        // const images = await spot.getSpotImages();


        // for (r of reviews) {
        //     total += r.dataValues.stars;
        // }

        // let previewImage = "";
        // for ( i of images)
        // {
        //     if (i.dataValues.preview)
        //         previewImage = i.dataValues.url

        // }
        previewImage = setPreview(spot.SpotImages)



        // let avgRating = total / reviews.length
        // let spotJ = spot.toJSON();
        // spotJ.avgRating = avgRating
        // spotJ.previewImage = previewImage
        // spotsList.push(spotJ)
        //console.log(images)
        let spotJ = spot.toJSON();
        spotJ.avgRating = avgRating(spot.Reviews)
        spotJ.previewImage = previewImage
        delete spotJ.SpotImages
        delete spotJ.Reviews
        spotsList.push(spotJ)
    }



    return res.json({Spots:spotsList,page,size});
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

        },
            include: [
                {
                    model: SpotImage
                },
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

    if (spot.SpotImages.length >= 5)
    {
        const err = new Error("Too many images")
        err.status = 503;
        err.title = "Too many images"
        next(err)
        // res.status(404);
        // return res.json
        // ({
        //     message: err.message
        // })
    }

    else {
        const {url, preview} = req.body;

        const spotId = req.params.spotId
        const image = await SpotImage.create({spotId, url, preview} )


        res.json({id: image.id, url, preview})
    }
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
        res.status(404);
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
        res.status(404);
        return res.json({message:err.message})

    }

    for (let r of spot.Reviews)
    {
        if (r.userId === userId)
        {

            const err = new Error("User already has a review for spot")
            res.status(500);
            //return next(err)
            // err.errors ={alreadyExists: "User already has a review"}
            return res.json({
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

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const user = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            userId: user,
            spotId: req.params.spotId
        },
        include: [
            {

                model: User,
                attributes: [
                    'id', 'firstName', 'lastName'
                ]

            }

        ]
    })


    const bookings2 = await Booking.findAll({
        where: {
            spotId: req.params.spotId,
            userId: {
                [Op.not]: user
            }
        },
        attributes: [
                'spotId', 'startDate', 'endDate'
            ]
    })

    if (bookings.length === 0 && bookings2.length === 0)
    {
        const err = new Error("Spot couldn't be found")
        err.status = 404;
        res.json({
            message: err.message
        })

    }


    const bookingsList = []

    for (b of bookings)
    {
        let bookingsJ = b.toJSON()
        let e = bookingsJ.endDate.toString()
        bookingsJ.endDate = e.slice(0, 10)
        let s = bookingsJ.startDate.toString()
        bookingsJ.startDate = s.slice(0, 10)
        bookingsList.push(bookingsJ)
    }

    for (b of bookings2) {
        let bookingsJ = b.toJSON()
        let e = bookingsJ.endDate.toString()
        bookingsJ.endDate = e.slice(0, 10)
        let s = bookingsJ.startDate.toString()
        bookingsJ.startDate = s.slice(0, 10)
        bookingsList.push(bookingsJ)
    }

    //bookingsList.push(...bookings2)



    res.json(bookingsList)


})

router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
{
    let {startDate, endDate} = req.body;
    startDate = new Date(startDate)
    endDate = new Date(endDate)

    const spot = await Spot.findByPk(req.params.spotId,
        {
            include: [
                {model: Booking}
            ]
    })

    if (!spot) {
        const err = new Error("Spot couldn't be found")
        err.status = 403;
        res.json({
            message: err.message
        })
    }

    if (spot.id === req.user.id)
    {
        const err = new Error("You own this spot")
        err.status = 403;
        res.json({
            message: err.message
        })
    }


    let errors = {};
    for (b of spot.Bookings)
    {
        let sD = new Date(b.startDate)
        let eD = new Date(b.endDate)
        if (startDate >= sD && startDate <= eD)
            errors.startDate = "Start date conflicts with an existing booking"
        if (endDate >= sD && endDate <= eD)
            errors.endDate = "End date conflicts with an existing booking"

        if (errors.startDate  || errors.endDate)
        {
            const err = new Error("Sorry, this spot is already booked for the specified dates")
            err.status = 403
            res.json({
                message: err.message,
                errors
            })
        }

    }

    const book = await Booking.create({ spotId: spot.id, userId: req.user.id, startDate, endDate })

    res.send(book)


}})
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
