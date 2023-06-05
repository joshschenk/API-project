import { csrfFetch } from "./csrf";
export const LIST_SPOTS = "spots/LIST_SPOTS"
export const ADD_SPOT = "spots/ADD_SPOT"
export const CURRENT_SPOTS = "spots/CURRENT_SPOTS"
export const REMOVE_SPOT = "spots/REMOVE_SPOT"

export const listSpots = (spots) => ({
    type: LIST_SPOTS,
    spots,
})

export const currentSpots = (spots) => ({
    type: CURRENT_SPOTS,
    spots,
})

export const addSpot = (spot) => ({
    type: ADD_SPOT,
    spot
})

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId

})

//thunk action creators

export const fetchDeleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    });

    if (res.ok) {
        dispatch(removeSpot(spotId));
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const fetchCurrentSpots = () => async (dispatch) => {
    const res = await csrfFetch("/api/spots/current")

    if (res.ok) {
        const spots = await res.json();
        dispatch(currentSpots(spots));
    }

}

export const fetchSpots = () => async (dispatch) => {
    const res = await csrfFetch("api/spots?page=1&size=15&maxLat=89");

    if (res.ok)
    {
        const spots = await res.json();
        dispatch(listSpots(spots));
    }
};



const spotsReducer = (state = {}, action) => {
    switch(action.type) {
        case ADD_SPOT:
            // console.log("Price..." + action.spot.price)
            const newState = {...state, [action.spot.id]: {...action.spot}}
            return newState;
        case CURRENT_SPOTS:
            const currentSpots = {};
            action.spots.forEach((spot) => {
                currentSpots[spot.id] = spot;
            });
            return currentSpots;
        case LIST_SPOTS:
            const spotsState = {}
            action.spots.Spots.forEach((spot) => {
                spotsState[spot.id] = spot;
            });
            return spotsState;
        case REMOVE_SPOT:
            const removeState = { ...state };
            delete removeState[action.spotId];
            return removeState;
        default:
            return state;
    }
}

export default spotsReducer
