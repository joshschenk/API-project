import { useModal } from "../../context/Modal";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import StarRating from "../StarRating";
import { useHistory } from "react-router-dom";
import { fetchAddReview } from "../../store/reviews";
import { fetchReviews } from "../../store/reviews";


function ReviewFormModal ({spotId}) {
    const history = useHistory();
    const [reviewText, setReviewText] = useState("")
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch()

    const {closeModal} = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();

        let err = {};
        dispatch(fetchAddReview({review: reviewText, stars: rating}, spotId ))
            .then(()=> {
                dispatch(fetchReviews(spotId));
                closeModal();

                //
            }).catch(async (res)=> {
                const data = await res.json()
                console.log(data)
            })






        // let result = {}

        // try {
        //     result = dispatch(fetchAddReview({ review: reviewText, stars: rating }, spotId))
        // }
        // catch (error) {

        // }

    }


    const onChange = (rating) => {
        setRating(parseInt(rating))
    }


    return (
        <>
            <h2>How was your stay</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Leave your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                >

                </textarea>
                <br/>
                <StarRating rating={rating} onChange={onChange}/>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </>
    )
}

export default ReviewFormModal;
