import {Link} from "react-router-dom";

import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import { fetchSpots } from "../../store/spots";

import Spot from "../Spot"

const ListSpots = () => {

    const spots = Object.values(
        useSelector((state) => (state.spots ? state.spots : []))
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);




    return (
        <ul>
            {spots.map((spot) => (

                <Spot spot={spot} key={spot.id}/>
            ))}
        </ul>


    );


};

export default ListSpots;
