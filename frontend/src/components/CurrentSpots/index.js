import { Link } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCurrentSpots } from "../../store/spots";
import { fetchDeleteSpot } from "../../store/spots"
import Spot from "../Spot"

const CurrentSpots = () => {

    const spots = Object.values(
        useSelector((state) => (state.spots ? state.spots : []))
    );

    const dispatch = useDispatch();
    const handleDelete = (e) => {
        e.preventDefault();
        const spotId = e.currentTarget.getAttribute("spotid")

        dispatch(fetchDeleteSpot(spotId));
    };



    useEffect(() => {
        dispatch(fetchCurrentSpots());
    }, [dispatch]);



    return (
        <>
            <ul>
                {spots.map((spot) => (
                    <>
                    <Spot spot={spot} key={spot.id} />
                    <Link to={`/spots/${spot.id}/edit`}>
                        <button >update</button>
                    </Link>
                    <button spotid={spot.id} onClick={handleDelete}>delete</button>
                    </>
                ))}
            </ul>
        </>
    )
}

export default CurrentSpots;
