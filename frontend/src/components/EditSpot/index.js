import { useParams } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSpot } from "../../store/spot";

import CreateSpot from "../CreateSpot"

const EditSpot = () => {
    const { spotId } = useParams();




    const dispatch = useDispatch();

    const spot = useSelector((state) =>
        state.spot ? state.spot : null
    );


    useEffect(() => {
        dispatch(fetchSpot(spotId));

    }, [dispatch, spotId]);


    if (!spot) return <></>;

    return (
        Object.keys(spot).length > 1 && (
            <>
                <CreateSpot spot={spot} formType="Update" />
            </>
        )
    );
};

export default EditSpot;
