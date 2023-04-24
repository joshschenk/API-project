const express = require('express');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const user = require('../../db/models/user');
const spotimage = require('../../db/models/spotimage');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateBooking =
    [

        check('startDate')
            .exists({ checkFalsy: true })
            .notEmpty()
            .custom((value, { req }) => {
                let sD = new Date(req.body.startDate)
                let eD = new Date(req.body.endDate)
                return sD < eD

            })
            .withMessage('endDate cannot be on or before startDate'),
        handleValidationErrors

    ]

router.get('/current', requireAuth, async (req, res, next) => {

    const user = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            userId: user
        },
        include: [
            { model: Spot,
                include: [
                    {model: SpotImage}
                ]
            }

        ]
    })

    let bookingsList = []

    for (let book of bookings)
    {
        let bookingsJ = book.toJSON()
        bookingsJ.Spot.previewImage = setPreview(bookingsJ.Spot.SpotImages)
        delete bookingsJ.Spot.SpotImages
        delete bookingsJ.Spot.createdAt
        delete bookingsJ.Spot.updatedAt
        let e = bookingsJ.endDate.toString()
        bookingsJ.endDate = e.slice(0, 10)
        let s = bookingsJ.startDate.toString()
        bookingsJ.startDate = s.slice(0, 10)

        bookingsList.push(bookingsJ)
    }

    res.json({Bookings: bookingsList})
})


router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {

    const booking = await Booking.findByPk(req.params.bookingId)

    if (!booking) {
        const err = new Error("Booking couldn't be found")
        err.status = 404;
        return res.json({
            message: err.message
        })
    }

    if (booking.spotId != req.user.id) {
        const err = new Error("You don't have a booking here")
        err.status = 403;
        return res.json({
            message: err.message
        })
    }

    let current = new Date();
    let startDate = new Date (req.body.startDate);
    let endDate = new Date(req.body.endDate);

    if (current > endDate)
    {
        const err = new Error("Past bookings can't be modified")
        err.status = 403;
        return res.json({
            message: err.message
        })
    }

    let sD = new Date (booking.startDate);
    let eD = new Date (booking.endDate)

    let errors = {}
    if (startDate >= sD && startDate <= eD)
        errors.startDate = "Start date conflicts with an existing booking"
    if (endDate >= sD && endDate <= eD)
        errors.endDate = "End date conflicts with an existing booking"

    if (errors.startDate || errors.endDate) {
        const err = new Error("Sorry, this spot is already booked for the specified dates")
        err.status = 403
        return res.json({
            message: err.message,
            errors
        })
    }

    const book = await Booking.create({ spotId: booking.spotId, userId: req.user.id, startDate, endDate })
    res.json(book)
})


router.delete('/:bookingId', requireAuth,  async (req, res, next) => {


    const booking = await Booking.findByPk(req.params.bookingId,
        {
            where:
            {
                id: req.params.bookingId,
                userId: req.user.id

            }
        })

    if (!booking) {
        const err = new Error("Booking couldn't be found")
        err.status = 404;
        return res.json({
            message: err.message
        })
    }

    let current = new Date();
    let startDate = new Date(booking.startDate);

    if (current > startDate) {
        const err = new Error("Bookings that have been started can't be deleted")
        err.status = 403;
        return res.json({
            message: err.message
        })
    }

    await booking.destroy();

    return res.json({ message: "Successfully deleted" })

})
function setPreview(spotImages) {
    let preview = ""
    for (image of spotImages) {
        if (image.preview)
            preview = image.url
    }

    return preview;
}



module.exports = router;
