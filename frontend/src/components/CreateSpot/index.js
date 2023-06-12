import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useDispatch } from "react-redux";

import {updateSpot, addImage, fetchDeleteImage} from "../../store/spot";
import {createSpot} from "../../store/spot";
import { addSpot } from "../../store/spots";
import "./index.css"


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
        if (address === "" || !address)
        {
            formErrors.address = "Address is required"
            correct = false;
        }
        if (country === "" || !country) {
            formErrors.country = "Country is required"
            correct = false;
        }
        if (city === "" || !city)
        {
            formErrors.city = "City is required"
            correct = false;
        }
        if (state === "" || !state) {
            formErrors.state = "State is required"
            correct = false;
        }
        if (country === "" || !country) {
            formErrors.name = "Country is required"
            correct = false;
        }
        if (name === "" || !name) {
            formErrors.name = "Name is required"
            correct = false;
        }
        if (description === "" || description?.length < 30 || !description) {

            formErrors.description = "Description needs a minimum of 30 characters"
            correct = false;
        }

        if (price === "" || !price || price < 1) {
            formErrors.price = "Price is required"
            correct = false;
        }

        if (previewImage === "") {
            formErrors.preview = "Preview image required"
            correct = false;
        }
        else if (previewImage?.endsWith(".png") || previewImage?.endsWith(".jpg") || previewImage?.endsWith(".jpeg") )
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
        console.log(city)
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
        <form className= "createform"onSubmit={handleSubmit}>
            <h2>{formTypeHTML}</h2>
            <h4>Where's your place located?</h4>
            <span>Guests will only get your exact</span>
            <span className="lastText"> address once they booked a reservation</span>
            <label>
                Address
            </label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value)}}
                />

            {errors.address && <div><br/>{errors.address}</div>}
            <label>
                City
            </label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

            {errors.city && <div>{errors.city}</div>}
            <label>
                State
            </label>
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />

            {errors.state && <div>{errors.state}</div>}
            <label>
                Country
            </label>
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />

            {errors.country && <div>{errors.country}</div>}

            <h4>Describe your place to guests</h4>
            <span>Mention the best features of your space, any special amentities like</span>
            <span className="lastDesc">fast wifi or parking, and what you love about the neighborhood.</span>
                <textarea
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

            {errors.description && <div>{errors.description}</div>}

            <h4>Create a title for your spot</h4>
            <span className="lastNa">Catch guests' attention with a spot title that highlights what makes
                your place special.</span>
            <input
                type="text"
                placeholder="Name of your spot"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            {errors.name && <div>{errors.name}</div>}

            <h4>Set a base price for your spot</h4>
            <span className="lastPrice">Competitive pricing can help your listing stand out and rank higher
                in search results</span>
                <input
                    className="pricefield"
                    type="number"
                    placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

            {errors.price && <div>{errors.price}</div>}


                <h4>Liven up your spot with photos</h4>
                <span>Submit a link to at least one photo to publish your spot.</span>
                <input
                    type="text"
                    placeholder="Preview Image URL"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                />
                {errors.preview && <div>{errors.preview}</div>}


                <input
                    type="text"
                    placeholder="Image URL"
                    value={spotImage1}
                    onChange={(e) => setSpotImage1(e.target.value)}
                />
                {errors.spotImage1 && <div>{errors.spotImage1}</div>}

                <input
                    type="text"
                    placeholder="Image URL"
                    value={spotImage2}
                    onChange={(e) => setSpotImage2(e.target.value)}
                />
                {errors.spotImage2 && <div>{errors.spotImage2}</div>}

                <input
                    type="text"
                    placeholder="Image URL"
                    value={spotImage3}
                    onChange={(e) => setSpotImage3(e.target.value)}
                />
                {errors.spotImage3 && <div>{errors.spotImage3}</div>}

                <input
                    type="text"
                    placeholder="Image URL"
                    value={spotImage4}
                    onChange={(e) => setSpotImage4(e.target.value)}
                />
                {errors.spotImage4 && <div>{errors.spotImage4}</div>}


            <button type="submit">New Spot</button>
        </form>
    );
};

export default CreateSpot;
