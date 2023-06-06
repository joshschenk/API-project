import { useDispatch } from "react-redux";
import { fetchDeleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import { fetchDeleteReview } from "../../store/reviews";
export default function DeleteModal({spotId, reviewId, type}) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const deleteText = type === "review" ?
        "Yes (Delete Review)" :
        "Yes (Delete Spot)"

    const dontDeleteText = type === "review" ?
        "No (Keep Review)":
        "No (Keep Spot)"


    const handleDelete = (e) => {
        e.preventDefault();
        if (type === "review")
        {
            console.log(reviewId)
            return dispatch(fetchDeleteReview(reviewId)).then(closeModal)
        }
        else
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
            <button onClick={handleDelete}>{deleteText}</button>
            <button onClick={handleNotDelete}>{dontDeleteText}</button>

        </>

    );
}
