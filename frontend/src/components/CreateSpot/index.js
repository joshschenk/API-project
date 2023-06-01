import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useDispatch } from "react-redux";

import {updateSpot, addImage, fetchDeleteImage} from "../../store/spot";
import {createSpot} from "../../store/spot";
import { addSpot } from "../../store/spots";


const CreateSpot = (spot) => {

    let count = 0;
    let spotImages = [null,null,null,null,null];
    for (let i = 0; i < spot?.spot?.SpotImages.length; i++) {
        if (!spot?.spot?.SpotImages[i].preview) {
            spotImages[count] = spot?.spot?.SpotImages[i]
            count++;
        }
        else
            spotImages[4] = spot.spot.SpotImages[i]

    }


    const history = useHistory();
    const [address, setAddress] = useState(spot?.spot?.address);
    const [city, setCity] = useState(spot?.spot?.city);
    const [state, setState] = useState(spot?.spot?.state);
    const [country, setCountry] = useState(spot.spot?.country);
    const [name, setName] = useState(spot.spot?.name);
    const [description, setDescription] = useState(spot.spot?.description);
    const [price, setPrice] = useState(spot.spot?.price);
    const [previewImage, setPreviewImage] = useState(spot.spot?.previewImage);

    const [spotImage1, setSpotImage1] = useState(spotImages[0]?.url || "");
    const [spotImage2, setSpotImage2] = useState(spotImages[1]?.url || "");
    const [spotImage3, setSpotImage3] = useState(spotImages[2]?.url || "");
    const [spotImage4, setSpotImage4] = useState(spotImages[3]?.url || "") ;

    const [errors, setErrors] = useState({});


    let newSpot = {};

    useEffect(() => {
        setState(spot.spot?.state)
        setCity(spot.spot?.city)
        setCountry(spot.spot?.country)
        setAddress(spot.spot?.address)
        setName(spot.spot?.name)
        setDescription(spot.spot?.description)
        setPrice(spot.spot?.price)
        setPreviewImage(spot.spot?.previewImage)
        setSpotImage1(spotImages[0]?.url || "")
        setSpotImage2(spotImages[1]?.url || "")
        setSpotImage3(spotImages[2]?.url || "")
        setSpotImage4(spotImages[3]?.url || "")
    },[spot])



    const formType = spot.formType
    let formTypeHTML = "Update your Spot"
    if (formType !== "Update")
        formTypeHTML = "Create a new Spot"
    const spotId = spot.spot?.id
    const dispatch = useDispatch();

    const validate = () => {
        let correct = true;
        let formErrors = {}
        if (address === "")
        {
            formErrors.address = "Address is required"
            correct = false;
        }
        if (country === "") {
            formErrors.country = "Country is required"
            correct = false;
        }
        if (city === "") {
            formErrors.city = "City is required"
            correct = false;
        }
        if (state === "") {
            formErrors.state = "State is required"
            correct = false;
        }
        if (country === "") {
            formErrors.name = "Name is required"
            correct = false;
        }
        if (description.length < 30) {
            formErrors.description = "Description needs a minimum of 30 characters"
            correct = false;
        }

        if (previewImage === "") {
            formErrors.preview = "Preview image required"
            correct = false;
        }
        else if (previewImage.endsWith(".png") || previewImage.endsWith(".jpg") || previewImage.endsWith(".jpeg") )
        {
            ;
        }
        else
        {
            formErrors.preview = "Image URL must end in .png, .jpg, or .jpeg"
            correct = false;
        }

        if (spotImage1)
        {
            if (spotImage1.endsWith(".png") || spotImage1.endsWith(".jpg") || spotImage1.endsWith(".jpeg")) {
                ;
            }
            else {
                formErrors.spotImage1 = "Image URL must end in .png, .jpg, or .jpeg"
                correct = false;
            }
        }
        if (spotImage2) {
            if (spotImage2.endsWith(".png") || spotImage2.endsWith(".jpg") || spotImage2.endsWith(".jpeg")) {
                ;
            }
            else {
                formErrors.spotImage2 = "Image URL must end in .png, .jpg, or .jpeg"
                correct = false;
            }
        }
        if (spotImage3) {
            if (spotImage3.endsWith(".png") || spotImage3.endsWith(".jpg") || spotImage3.endsWith(".jpeg")) {
                ;
            }
            else {
                formErrors.spotImage3 = "Image URL must end in .png, .jpg, or .jpeg"
                correct = false;
            }
        }
        if (spotImage4) {
            if (spotImage4.endsWith(".png") || spotImage4.endsWith(".jpg") || spotImage4.endsWith(".jpeg")) {
                ;
            }
            else {
                formErrors.spotImage4 = "Image URL must end in .png, .jpg, or .jpeg"
                correct = false;
            }
        }

        setErrors(formErrors)

        return correct;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const lat = 45;
        const lng = 92;
        const formSpot = { address, city, state, country, lat, lng, name, description, price, previewImage }


        if (formType !== "Update")
        {
            if (validate())
            {
                newSpot = await dispatch(createSpot(formSpot));
                await dispatch(addImage(newSpot.id, { url: previewImage, preview: true }))
                if (spotImage1)
                    await dispatch(addImage(newSpot.id, { url: spotImage1, preview: false }))
                if (spotImage2)
                    await dispatch(addImage(newSpot.id, { url: spotImage2, preview: false }))
                if (spotImage3)
                    await dispatch(addImage(newSpot.id, { url: spotImage3, preview: false }))
                if (spotImage4)
                    await dispatch(addImage(newSpot.id, { url: spotImage4, preview: false }))

                await dispatch(addSpot(newSpot))

                history.push(`/spots/${newSpot.id}`);
            }
        }
        else if (formType==="Update")
        {
            if (validate())
            {
                newSpot = await dispatch(updateSpot(formSpot, spotId))
                await dispatch(fetchDeleteImage(spotImages[4].id))
                await dispatch(addImage(newSpot.id, { url: previewImage, preview: true }))
                await dispatch(addSpot(newSpot))

                if (spotImage1)
                {
                    if (spotImages[0])
                        await dispatch(fetchDeleteImage(spotImages[0].id))

                    await dispatch(addImage(newSpot.id, { url: spotImage1, preview: false }))

                }
                else {
                    if (spotImages[0])
                        await dispatch(fetchDeleteImage(spotImages[0].id))
                }

                if (spotImage2) {
                    if (spotImages[1])
                        await dispatch(fetchDeleteImage(spotImages[1].id))

                    await dispatch(addImage(newSpot.id, { url: spotImage2, preview: false }))

                }
                else {
                    if (spotImages[1])
                        await dispatch(fetchDeleteImage(spotImages[1].id))
                }

                if (spotImage3) {
                    if (spotImages[2])
                        await dispatch(fetchDeleteImage(spotImages[2].id))

                    await dispatch(addImage(newSpot.id, { url: spotImage3, preview: false }))

                }
                else {
                    if (spotImages[2])
                        await dispatch(fetchDeleteImage(spotImages[2].id))
                }
                if (spotImage4) {
                    if (spotImages[3])
                        await dispatch(fetchDeleteImage(spotImages[3].id))

                    await dispatch(addImage(newSpot.id, { url: spotImage4, preview: false }))

                }
                else
                {
                    if (spotImages[3])
                        await dispatch(fetchDeleteImage(spotImages[3].id))
                }

                history.push(`/spots/${newSpot.id}`);
            }
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <h2>{formTypeHTML}</h2>
            <label>
                Address:
                <br/>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            {errors.address && <div><br/>{errors.address}</div>}
            <br />
            <label>
                City:
                <br />
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </label>
            {errors.city && <div><br />{errors.city}</div>}
            <br />
            <label>
                State:
                <br />
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />
            </label>
            {errors.state && <div><br />{errors.state}</div>}
            <br />
            <label>
                Country:
                <br />
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </label>
            {errors.country && <div><br />{errors.country}</div>}
            <br />
            <label>
                Name:
                <br />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            {errors.name && <div><br />{errors.name}</div>}
            <br />
            <label>
                Description:
                <br />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            {errors.description && <div><br />{errors.description}</div>}
            <br />
            <label>
                Price:
                <br />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </label>
            {errors.price && <div><br />{errors.price}</div>}
            <br />
            <label>
                Liven up your spot with photos
                <br />
                <input
                    type="text"
                    placeholder="Preview Image URL"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                />
                {errors.preview && <div><br />{errors.preview}</div>}
                <br />

                <input
                    type="text"
                    placeholder="Image URL"
                    value={spotImage1}
                    onChange={(e) => setSpotImage1(e.target.value)}
                />
                {errors.spotImage1 && <div><br />{errors.spotImage1}</div>}
                <br />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={spotImage2}
                    onChange={(e) => setSpotImage2(e.target.value)}
                />
                {errors.spotImage2 && <div><br />{errors.spotImage2}</div>}
                <br />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={spotImage3}
                    onChange={(e) => setSpotImage3(e.target.value)}
                />
                {errors.spotImage3 && <div><br />{errors.spotImage3}</div>}
                <br />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={spotImage4}
                    onChange={(e) => setSpotImage4(e.target.value)}
                />
                {errors.spotImage4 && <div><br />{errors.spotImage4}</div>}
            </label>
            <br />
            <button type="submit">New Spot</button>
        </form>
    );
};

export default CreateSpot;
