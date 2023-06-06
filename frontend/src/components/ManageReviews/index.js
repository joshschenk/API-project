import { Link } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import { fetchCurrentReviews, fetchDeleteReview } from "../../store/reviews";
import DeleteModal from "../DeleteModal";
import OpenModalButton from "../OpenModalButton";

const ManageReviews = () => {
    const reviews = Object.values(
        useSelector((state) => (state.reviews.reviews ? state.reviews.reviews : []))
    );


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrentReviews());
    }, [dispatch]);

    return (
        <>
            <ul>
                {reviews.map((review) => (
                    <div key={review.id}>
                        <h3>{review?.Spot?.name}</h3>
                        <h4>{review?.review}</h4>
                        <OpenModalButton
                            buttonText="delete"
                            modalComponent={<DeleteModal reviewId={review.id} type="review" />}
                        />

                    </div>
                ))}
            </ul>
        </>
    )

}

export default ManageReviews
