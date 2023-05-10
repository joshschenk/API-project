import { csrfFetch } from "./csrf";

export const LIST_SPOT = "spots/LIST_SPOT"
export const RECEIVE_SPOT = "spots/RECEIVE_REPORT"
export const RECEIVE_IMAGE = "spots/RECEIVE_IMAGE"

export const listSpot = (spot) => ({
    type: LIST_SPOT,
    spot
})

export const receiveSpot = (report) => ({
    type: RECEIVE_SPOT,
    report,
});

export const receiveImage = (image) => ({
    type: RECEIVE_IMAGE,
    image
})

export const fetchSpot = (id) => async (dispatch) => {

    const res = await csrfFetch(`/api/spots/${id}`);

    if (res.ok) {
        const spot = await res.json();
        dispatch(listSpot(spot));
    }
};

export const createSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot),
    });
    if (res.ok) {
        const newSpot = await res.json();
        dispatch(receiveSpot(newSpot));
        return newSpot;
    } else {
        const errors = await res.json();
        return errors;
    }
};

export const addImage = (id, img) => async (dispatch) => {
    const res = await csrfFetch(`/api/${id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(img),
    });

    if (res.ok) {
        const newImg = await res.json();
        dispatch(receiveImage(newImg));
        return newImg;
    }

}
const spotReducer = (state = {}, action) => {
    switch (action.type) {
        case LIST_SPOT:
            const spotState = {...action.spot}
            return spotState;
        case RECEIVE_SPOT:
            const newSpot = {...action.spot}
            return newSpot
        // case RECEIVE_IMAGE:
        //     const newImage = //{...state, action.spot.spotImages}
        default:
            return state;


    }
}

export default spotReducer
