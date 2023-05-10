import { csrfFetch } from "./csrf";

export const LIST_SPOT = "spots/LIST_SPOT"

export const listSpot = (spot) => ({
    type: LIST_SPOT,
    spot
})

export const fetchSpot = (id) => async (dispatch) => {

    const res = await csrfFetch(`/api/spots/${id}`);

    if (res.ok) {
        const spot = await res.json();
        dispatch(listSpot(spot));
    }
};

const spotReducer = (state = {}, action) => {
    switch (action.type) {
        case LIST_SPOT:
            const spotState = {...action.spot}
            return spotState;
        default:
            return state;
    }
}

export default spotReducer
