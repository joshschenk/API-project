import { Link, useParams } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSpot } from "../../store/spot";
import { fetchReviews } from "../../store/reviews";
import "./index.css"
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import DeleteModal from "../DeleteModal";
import { clearSpot } from "../../store/spot";

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
        dispatch(clearSpot())
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
                className="newReview"
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
        <div className="detailsContainer">
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
            <div className="underImages">
                <div className="hostDescrip">
                    <div>
                        <h3>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</h3>
                    </div>
                    <div>
                        {spot.description}
                    </div>
                </div>
                <div className="reserveContainer">
                    <div className="reserveText">
                        <div className="reservePrice">
                            {`$${spot?.price} night`}
                        </div>
                        <div class="avgRatingReserve">
                            <i class="fa fa-star" />
                            <span >{spot.avgRating?.toFixed(1)}  &#183;</span>
                            <span>  {reviews.length} Reviews</span>
                        </div>
                    </div>
                    <button className="reserveButton">Reserve</button>
                </div>
            </div>
            <div class="avgRating">
                <div>
                    <i class="fa fa-star"/>
                    <span >{spot.avgRating?.toFixed(1)}  &#183;</span>
                    <span>  {reviews.length} Reviews</span>
                </div>
                <div >
                    {newReview}
                </div>
            </div>
            <div>
            {
                reviews?.map((review) => (
                    <div className="review" key={review.id}>
                        <div className="name">
                            {review.User.firstName}
                        </div>
                        <div className="date">
                            {getReviewDate(review.createdAt)}
                        </div>
                        <div>
                            {review.review}
                        </div>
                        <div>{reviewDelete(review)}</div>
                    </div>
                ))
            }
            </div>



        </div>
    )
}

export default SpotDetails;
