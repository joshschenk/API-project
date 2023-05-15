import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useDispatch } from "react-redux";

import {updateSpot, addImage} from "../../store/spot";
import {createSpot} from "../../store/spot";
import { addSpot } from "../../store/spots";


const CreateSpot = (spot) => {


    const history = useHistory();
    const [address, setAddress] = useState(spot?.spot?.address);
    const [city, setCity] = useState(spot?.spot?.city);
    console.log(city)
    const [state, setState] = useState(spot?.spot?.state);
    const [country, setCountry] = useState(spot.spot?.country);
    const [name, setName] = useState(spot.spot?.name);
    const [description, setDescription] = useState(spot.spot?.description);
    const [price, setPrice] = useState(spot.spot?.price);
    const [previewImage, setPreviewImage] = useState(spot.spot?.previewImage);
    const [errors, setErrors] = useState({});

    // useEffect(() => {
    //     setState(spot.spot.state)
    //     setCity(spot.spot.city)
    //     setCountry(spot.spot.country)
    //     setAddress(spot.spot.address)
    //     setName(spot.spot.name)
    //     setDescription(spot.spot.description)
    //     setPrice(spot.spot.price)
    //     setPreviewImage(spot.spot.previewImage)
    // },[useParams()])


    const formType = spot.formType
    const spotId = spot.spot?.id
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const lat = 45;
        const lng = 92;
        const spot = { address, city, state, country, lat, lng, name, description, price, previewImage }

        if (formType !== "Update")
        {
            const newSpot = await dispatch(createSpot(spot));
            await dispatch(addImage(newSpot.id, { url: previewImage, preview: true }))
            await dispatch(addSpot(newSpot))

            history.push(`/spots/${newSpot.id}`);
        }
        else if (formType==="Update")
        {
            const newSpot = await dispatch(updateSpot(spot, spotId));

            history.push(`/spots/${newSpot.id}`);
        }


    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>New Spot</h2>
            <label>
                Address:
                <input
                    type="text"
                    value={spot?.spot?.address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <label>
                City:
                <input
                    type="text"
                    value={spot?.spot?.city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </label>
            <label>
                State:
                <input
                    type="text"
                    value={spot?.spot?.state}
                    onChange={(e) => setState(e.target.value)}
                />
            </label>
            <label>
                Country:
                <input
                    type="text"
                    value={spot?.spot?.country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </label>
            <label>
                Name:
                <input
                    type="text"
                    value={spot?.spot?.name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Description:
                <input
                    type="text"
                    value={spot?.spot?.description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <label>
                Price:
                <input
                    type="number"
                    value={spot?.spot?.price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </label>
            <label>
                Image:
                <input
                    type="text"
                    value={spot?.spot?.previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                />
            </label>
            <button type="submit">New Spot</button>
        </form>
    );
};

export default CreateSpot;
