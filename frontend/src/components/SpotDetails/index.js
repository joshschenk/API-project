import { Link, useParams } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSpot } from "../../store/spot";
import { fetchReviews } from "../../store/reviews";
import "./index.css"
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import DeleteModal from "../DeleteModal";

const SpotDetails = () => {
    const { spotId } = useParams();

    const sessionUser = useSelector((state) => state.session.user);
    const spot = useSelector((state => state.spot ? state.spot : null))

    const spotOwner = sessionUser?.id === spot.ownerId;

    const reviews = Object.values(
        useSelector((state=> state.reviews.reviews ? state.reviews.reviews: []))
    );



    reviews.sort((a, b) => {
        let d1 = new Date(a.updatedAt).getTime();
        let d2 = new Date(b.updatedAt).getTime();


        if (d1 > d2)
            return -1;
        if (d1 < d2)
            return 1;
        return 0;
    });

    const reviewDelete = (review) => {
        console.log(review)
        if (review?.userId === sessionUser?.id)
        {
            return (
                <OpenModalButton
                    buttonText="delete"
                    modalComponent={<DeleteModal reviewId={review?.id} type="review"/>}
                />
            )
        }
        else {
            return (
                <></>
            )
        }
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpot(spotId))
        dispatch(fetchReviews(spotId))
    }, [dispatch, spotId])



    let spotImages = spot.SpotImages?.slice()
    let preview;
    if (spotImages)
    {
        preview = spotImages[0];
        spotImages = spotImages.slice(1)
    }


    let newReview;
    if (!spotOwner) {
       newReview = (

            <OpenModalButton
                buttonText="Post your Review"
                modalComponent={<ReviewFormModal spotId={spotId}/>}
            />
       )
    }
    else
        newReview = (<></>)

    const getReviewDate = (createdAt) => {

        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const d = new Date( createdAt.slice(0,10));
        return month[d.getMonth()] + " " + d.getFullYear();
        //return d.getMonth() + " " + d.getYear()
    }


    return (
        <>
            <div className="imagesContainer">
                <div className="preview">
                    <img src={preview?.url} key={preview?.id} alt={preview?.id} />
                </div>
                <div className="nonPreviewContainer">
                {
                    spotImages?.map((image) => (
                        <div className="nonPreview">
                            <img src={image.url} key={image.id} alt={image.id} />
                        </div>
                    ))
                }
                </div>
            </div>
            <div>
                <h3>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</h3>
            </div>
            <div>
                {spot.description}
            </div>
            <div>
                <h2>Reviews</h2>
                {newReview}
            </div>
            <div>
            {
                reviews?.map((review) => (
                    <div key={review.id}>
                        <div>
                            <h3>{review.User.firstName}</h3>
                        </div>
                        <div>
                            <h4>{getReviewDate(review.createdAt)}</h4>
                        </div>
                        <div>
                            {review.review}
                        </div>
                        <div>{reviewDelete(review)}</div>
                    </div>
                ))
            }
            </div>



        </>
    )
}

export default SpotDetails;
