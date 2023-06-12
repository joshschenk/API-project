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

    const getReviewDate = (createdAt) => {

        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const d = new Date(createdAt.slice(0, 10));
        return month[d.getMonth()] + " " + d.getFullYear();
        //return d.getMonth() + " " + d.getYear()
    }

    console.log(reviews)

    return (
        <div>

                {/* {reviews.map((review) => (
                    <div key={review.id}>
                        <h3>{review?.Spot?.name}</h3>
                        <h4>{review?.review}</h4>
                        <OpenModalButton
                            buttonText="delete"
                            modalComponent={<DeleteModal reviewId={review.id} type="review" />}
                        />

                    </div>
                ))} */}
                <h2>Manage Reviews</h2>

                {
                    reviews?.map((review) => (
                        <div className="review" key={review.id}>
                            <div className="name">
                                {review.Spot.name}
                            </div>
                            <div className="date">
                                {getReviewDate(review.createdAt)}
                            </div>
                            <div className="reviewWords">
                                {review.review}
                            </div>
                            <button className="updateReview">Update</button>
                            <OpenModalButton
                            buttonText="delete"
                            modalComponent={<DeleteModal reviewId={review.id} type="review" />}
                        />
                        </div>
                    ))
                }

        </div>
    )

}

export default ManageReviews
