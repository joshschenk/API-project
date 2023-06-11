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
    const [rating, setRating] = useState(1);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch()

    const {closeModal} = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(fetchAddReview({review: reviewText, stars: rating}, spotId ))
            .then(()=> {
                dispatch(fetchReviews(spotId));
                closeModal();

                //
            }).catch(async (res)=> {
                const data = await res.json()
                console.log(data)
            })

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
                    <button type="submit" disabled={reviewText.length < 10}>Submit</button>
                </div>
            </form>
        </>
    )
}

export default ReviewFormModal;
