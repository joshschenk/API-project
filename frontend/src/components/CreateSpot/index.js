import { useState } from "react";
import { useHistory } from "react-router-dom";

import { useDispatch } from "react-redux";

import {createSpot} from "../../store/spot";


const CreateSpot = () => {
    const history = useHistory();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState();
    const [country, setCountry] = useState();
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();
    const [previewImage, setPreviewImage] = useState();
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const lat = 45;
        const lng = 92;
        const spot = { address, city, state, country, lat, lng, name, description, price, previewImage }

        const newSpot = await dispatch(createSpot(spot));

        history.push(`/spots/${newSpot.id}`);
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>New Spot</h2>
            <label>
                Address:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <label>
                City:
                <textarea
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </label>
            <label>
                State:
                <textarea
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />
            </label>
            <label>
                Country:
                <textarea
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </label>
            <label>
                Name:
                <textarea
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <label>
                Price:
                <textarea
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </label>
            <label>
                Image:
                <textarea
                    value={previewImage}
                    onChange={(e) => previewImage(e.target.value)}
                />
            </label>
            <button type="submit">New Spot</button>
        </form>
    );
};

export default CreateSpot;
