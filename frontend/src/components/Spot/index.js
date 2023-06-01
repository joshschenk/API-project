import { Link } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpot } from "../../store/spots";



const Spot = ({spot}) => {



    return (

        <div className="spot">
            <div >
                <Link to={`/spots/${spot.id}`}>
                    <img className="spotImage" src={spot.previewImage} alt="preview"/>
                </Link>
            </div>
            <div className="spotText">
                <div class="spotTextCityStar">
                    <div>
                        {spot.city},{spot.state}
                    </div>
                    <div>
                        <span class="fa fa-star"></span>{spot.avgRating}
                    </div>
                </div>

                <div>
                    ${spot.price} night
                </div>
            </div>
        </div>


    )
}

export default Spot;
