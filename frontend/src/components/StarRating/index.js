import {useEffect, useState} from 'react';

import "./index.css"

const StarRating = ({disabled, onChange, rating }) => {

    const [activeRating, setActiveRating] = useState(rating);



    useEffect(() => {
        setActiveRating(rating);
    }, [rating]);

    disabled = false;




    return (
        <div className="ratings">
            <div
                className={"filled"}
                onMouseEnter={() => { if (!disabled) setActiveRating(1) }}
                onMouseLeave={() => { if (!disabled) setActiveRating(rating) }}
                onClick={() => { if (!disabled) onChange(1) }}
            >
                <i className="fa fa-star"></i>
            </div>
            <div
                className={activeRating >= 2 ? "filled" : "empty"}
                onMouseEnter={() => { if (!disabled) setActiveRating(2) }}
                onMouseLeave={() => { if (!disabled) setActiveRating(rating) }}
                onClick={() => { if (!disabled) onChange(2) }}
            >
                <i className="fa fa-star"></i>
            </div>
            <div
                className={activeRating >= 3 ? "filled" : "empty"}
                onMouseEnter={() => { if (!disabled) setActiveRating(3) }}
                onMouseLeave={() => { if (!disabled) setActiveRating(rating) }}
                onClick={() => { if (!disabled) onChange(3) }}
            >
                <i className="fa fa-star"></i>
            </div>
            <div
                className={activeRating >= 4 ? "filled" : "empty"}
                onMouseEnter={() => { if (!disabled) setActiveRating(4) }}
                onMouseLeave={() => { if (!disabled) setActiveRating(rating) }}
                onClick={() => { if (!disabled) onChange(4) }}
            >
                <i className="fa fa-star"></i>
            </div>
            <div
                className={activeRating >= 5 ? "filled" : "empty"}
                onMouseEnter={() => { if (!disabled) setActiveRating(5) }}
                onMouseLeave={() => { if (!disabled) setActiveRating(rating) }}
                onClick={() => { if (!disabled) onChange(5) }}
            >
                <i className="fa fa-star"></i>
            </div>
        </div>
    );
};

export default StarRating;
