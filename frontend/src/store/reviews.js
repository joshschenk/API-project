import { csrfFetch } from "./csrf";

//action creators
export const LIST_REVIEWS = "reviews/LIST_REVIEWS"

export const listReviews = (reviews) => ({
    type: LIST_REVIEWS,
    reviews,
})


export const fetchReviews = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`);
    if (res.ok) {
        const reviews = await res.json();
        dispatch(listReviews(reviews));
    }


};

const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case LIST_REVIEWS:
            const reviewsState = {}
            action.reviews.Reviews.forEach((review) => {
                reviewsState[review.id] = review;
            });

            return reviewsState;
        default:
            return state;
    }
}

export default reviewsReducer
