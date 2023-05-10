import { Link, useParams } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSpot } from "../../store/spot";
import { fetchReviews } from "../../store/reviews";

const SpotDetails = () => {
    const { spotId } = useParams();



    const spot = useSelector((state => state.spot ? state.spot : null))
    const reviews = Object.values(
        useSelector((state=> state.reviews ? state.reviews: []))
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpot(spotId))
        dispatch(fetchReviews(spotId))
    }, [dispatch, spotId])


    console.log("In component")
    console.log(spot)
    return (
        <>
            {spot.name}
            {
                spot.SpotImages?.map((image) => (
                    <img src={image.url} key={image.id} alt={image.id} />
                ))
            }
            {
                reviews?.map((review) => (
                    <div key={review.id}>{review.User.firstName}<br />{review.review}</div>
                ))
            }



        </>
    )
}

export default SpotDetails
