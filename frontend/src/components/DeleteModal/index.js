import { useDispatch } from "react-redux";
import { fetchDeleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";

export default function DeleteModal({spotId}) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        return dispatch(fetchDeleteSpot(spotId)).then(closeModal);
    }

    const handleNotDelete = (e) => {
        e.preventDefault();
        closeModal();
    }
    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot
                from the listings?</p>
            <button onClick={handleDelete}>Yes (Delete Spot)</button>
            <button onClick={handleNotDelete}>No (Keep Spot)</button>

        </>

    );
}
