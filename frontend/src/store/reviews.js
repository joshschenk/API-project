import { csrfFetch } from "./csrf";

//action creators
export const LIST_REVIEWS = "reviews/LIST_REVIEWS"
export const ADD_REVIEW = "review/ADD_REVIEW"

export const listReviews = (reviews) => ({
    type: LIST_REVIEWS,
    reviews,
})

export const addReview = (review) => ({
    type: ADD_REVIEW,
    review
})

export const fetchAddReview = (review, spotId) =>  async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
    });

    if (res.ok) {
        const rev = await res.json();
        dispatch(addReview(rev))
        return rev;
    }
    else {
        const errors = await res.json();
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
            return {reviews: reviewsState, review: state.review };
        // case ADD_REVIEW:
        //     constReview
        default:
            return state;
    }
}

export default reviewsReducer
