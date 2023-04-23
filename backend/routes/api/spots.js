const express = require('express');
const {Spot} = require('../../db/models');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();

    let spotsList = [];

    for (let spot of spots) {
        let total = 0;
        const reviews = await spot.getReviews()

        for (r of reviews) {
            total += r.dataValues.stars;
        }

        let avgRating = total / reviews.length
        let spotJ = spot.toJSON();
        spotJ.avgRating = avgRating
        spotsList.push(spotJ)
    }
    console.log(spotsList)



    return res.json({Spots:spotsList});
})



module.exports = router;
