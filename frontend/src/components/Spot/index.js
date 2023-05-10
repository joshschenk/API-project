import { Link } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpot } from "../../store/spots";



const Spot = ({spot}) => {



    return (
        <>
            <div>
            <Link to={`/spots/${spot.id}`}>
                <img src={spot.previewImage} alt="preview"/>
            </Link>
            <br/>
            {spot.city},{spot.state} {spot.price}/night {spot.avgRating}
            </div>
        </>

    )
}

export default Spot;
