import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import { Link } from "react-router-dom";

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <div className="loggedIn">
                <Link className="newSpot" to="/spots/new">Create a New Spot</Link>
                <ProfileButton user={sessionUser} loggedIn={true} />


            </div>
        );
    } else {
        sessionLinks = (
            <div className="loginSignup">
                <ProfileButton user={sessionUser} loggedIn={false}/>
            </div>
        );
    }

    return (
        <div className="nav">
            <NavLink className="logo" exact to="/">
                    <img  alt="home" src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"/>
            </NavLink>
            {isLoaded && sessionLinks}
        </div>
    );
}

export default Navigation;
