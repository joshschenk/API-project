// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const handleDemo = () => {
        dispatch(sessionActions.login({credential: "demo@user.io", password: "password"}))
            .then(closeModal)
    }

    return (
        <div className="loginM">
        <div className="loginForm">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <div className="loginFields">
                        <label>
                            Username or Email
                        </label>
                        <input
                                type="text"
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                                required
                        />
                    <label>
                        Password
                    </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                {errors.credential && (
                    <p>{errors.credential}</p>
                )}
                <button className="submitButt" type="submit" disabled={(password.length < 6 || credential.length < 4)}>Log In</button>
                        <button onClick={handleDemo}>Demo User</button>
                </div>
            </form>

        </div>
        </div>
    );
}

export default LoginFormModal;
