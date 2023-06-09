import { Link } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCurrentSpots } from "../../store/spots";
import { fetchDeleteSpot } from "../../store/spots"
import Spot from "../Spot"
import DeleteModal from "../DeleteModal";
import OpenModalButton from "../OpenModalButton";
import "./index.css"

const CurrentSpots = () => {


    const spots = Object.values(
        useSelector((state) => (state.spots ? state.spots : []))
    );

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(fetchCurrentSpots());
    }, [dispatch]);

    return (
        <>
        <h2>Manange Spots</h2>
        <Link className="newSpot" to="/spots/new">
            <button class="newSpotBut">Create Spot</button>
        </Link>
        <div className="currentSpots">


                {spots.map((spot) => (
                    <div className="currentSpot">
                        <Spot spot={spot} key={spot.id} />
                        <Link to={`/spots/${spot.id}/edit`}>
                            <button class="updateSpotButt">update</button>
                        </Link>
                        <OpenModalButton

                            buttonText="delete"
                            modalComponent={<DeleteModal spotId={spot.id} />}
                        />

                    </div>
                ))}

        </div>
        </>
    )
}

export default CurrentSpots;
