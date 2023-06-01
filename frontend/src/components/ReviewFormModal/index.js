import { useModal } from "../../context/Modal";
import React, { useState } from "react";
import { useDispatch } from "react-redux";


function ReviewFormModal () {

    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault();
    }


    return (
        <>
            <h2>How was your stay</h2>
            <form onSubmit={handleSubmit}>
                <textarea placeholder="Leave your review here...">

                </textarea>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </>
    )
}

export default ReviewFormModal;
