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
        <div className="currentSpots">

                {spots.map((spot) => (
                    <div className="currentSpot">
                        <Spot spot={spot} key={spot.id} />
                        <Link to={`/spots/${spot.id}/edit`}>
                            <button >update</button>
                        </Link>
                        <OpenModalButton

                            buttonText="delete"
                            modalComponent={<DeleteModal spotId={spot.id} />}
                        />

                    </div>
                ))}

        </div>
    )
}

export default CurrentSpots;
