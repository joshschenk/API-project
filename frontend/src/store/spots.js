//action creators
export const LIST_SPOTS = "spots/LIST_SPOTS"

export const listSpots = (spots) => ({
    type: LIST_SPOTS,
    spots
})

//thunk action creators

export const fetchSpots = () => async (dispatch) => {
    const res = await fetch("api/spots?page=1&size=3&maxLat=43");

    if (res.ok)
    {
        const spots = await res.json();
        dispatch(listSpots(spots));
    }
};

const spotsReducer = (state = {}, action) => {
    switch(action.type) {
        case LIST_SPOTS:
            const spotsState = {}
            action.spots.forEach((spot) => {
                spotsState[spot.id] = spot;
            });
            return spotsState;
        default:
            return state;
    }
}

export default spotsReducer
