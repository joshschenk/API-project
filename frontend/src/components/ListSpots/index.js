import {Link} from "react-router-dom";

import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import { fetchSpots } from "../../store/spots";

import Spot from "../Spot"
import "./index.css";

const ListSpots = () => {

    const spots = Object.values(
        useSelector((state) => (state.spots ? state.spots : []))
    );

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("useeffect in spots")

        dispatch(fetchSpots());
    }, [dispatch]);

    return (
                <div className="spots">
                    {spots.map((spot) => (

                        <Spot spot={spot} key={spot.id}/>
                    ))}
                </div>


    );


};

export default ListSpots;
