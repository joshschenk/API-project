// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import "./ProfileButton.css"
import {Link} from "react-router-dom"
import { useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useModal } from "../../context/Modal";

function ProfileButton({ user, loggedIn }) {


    const history = useHistory();
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const {closeModal} = useModal();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const handleSpots = (e) => {
        e.preventDefault()
        setShowMenu(false)
        closeModal();
        history.push("/spots/current")
    }

    const handleReviews = (e) => {
        e.preventDefault()
        setShowMenu(false)
        closeModal();
        history.push("/reviews/current")
    }

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout()).then(closeModal);
        history.push("/")


    };

    let logged;
    if (loggedIn)

        logged = (
            <div className="profileLinks">
                <div>Hello, {user.firstName}</div>
                <div>{user.username}</div>

                <div>{ user.email }</div>
                <div><button onClick={handleSpots}>Manage Spots</button></div >
                <div><button onClick={handleReviews}>Manage Reviews</button></div >
                <div><button onClick={logout}>Log Out</button></div >
            </div>
        )
    else
        logged = (
            <div className="logSignForm">
                <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal className="logInModal" />}
                />
                <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal className="signUpModal"/>}
                />
            </div>
        )
    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    // const closeModalButton = () => {
    //     if ()
    // }

    return (
        <OpenModalButton className="proButton"
            // onclick={closeModalButton}
            buttonText={
                <div className= "profileObj">
                    <i className="fas fa-bars fa-2x" />
                    <i className="fas fa-user-circle fa-2x" />

                </div>
            }
            modalComponent={logged}
        />
        // <>
        //     <button onClick={openMenu}>

        //     </button>
        //     <ul className={ulClassName} ref={ulRef}>
        //         {logged}
        //     </ul>
        // </>
    );
}

export default ProfileButton;
