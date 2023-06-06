import { csrfFetch } from "./csrf";

//action creators
export const LIST_REVIEWS = "reviews/LIST_REVIEWS"
export const ADD_REVIEW = "review/ADD_REVIEW"
export const DELETE_REVIEW ="review/DELETE_REVIEW"
export const CURRENT_REVIEWS = "reviews/CURRENT_REVIEWS"

export const currentReviews = (reviews) => ({
    type: CURRENT_REVIEWS,
    reviews
})

export const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})

export const listReviews = (reviews) => ({
    type: LIST_REVIEWS,
    reviews,
})

export const addReview = (review) => ({
    type: ADD_REVIEW,
    review
})

export const fetchDeleteReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    });

    if (res.ok) {
        dispatch(deleteReview(reviewId))

    }
}

export const fetchCurrentReviews = () => async (dispatch) => {
    const res = await csrfFetch("/api/reviews/current")


    if (res.ok) {
        const reviews = await res.json();
        dispatch(currentReviews(reviews));
    }
}

export const fetchAddReview = (review, spotId) =>  async (dispatch) => {

    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
    })

    if (res.ok) {
        const rev = await res.json();
        dispatch(addReview(rev))
        return rev;
    }
    else {
        let errors = {}
        errors = await res.json()
        return errors;
    }

}


export const fetchReviews = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`);
    if (res.ok) {
        const reviews = await res.json();
        dispatch(listReviews(reviews));
    }


};

const reviewsReducer = (state = {reviews:{}, review:{}}, action) => {
    switch (action.type) {
        case LIST_REVIEWS:
            const reviewsState = {}
            action.reviews.Reviews.forEach((review) => {
                reviewsState[review.id] = review;
            });
            return {reviews: {...reviewsState}, review: {...state.review} };
        case ADD_REVIEW:
            const newReview = action.review
            return {reviews: {...state.reviews}, review: {...newReview}}
        case DELETE_REVIEW:
            const newReviews = {...state.reviews};
            delete newReviews[action.reviewId]
            return {reviews: {...newReviews}, review: {}}
        case CURRENT_REVIEWS:
            const currentReviews = {};

            action.reviews.Reviews.forEach((review) => {
                currentReviews[review.id] = review;
            });
            return {reviews: {...currentReviews}, review: {}}
        default:
            return state;
    }
}

export default reviewsReducer
