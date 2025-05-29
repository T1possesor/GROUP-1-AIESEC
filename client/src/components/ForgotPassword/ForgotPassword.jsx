import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaQuestionCircle, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [question1, setQuestion1] = useState("");
    const [question2, setQuestion2] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "visible";
        };
    }, []);

    const verifyUser = async (email, question1, question2) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DEV_URL}/api/clients?filters[email][$eq]=${email}&filters[question1][$eq]=${question1}&filters[question2][$eq]=${question2}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(errorMessage);
            }

            const data = await res.json();
            return data.data.length > 0;
        } catch (error) {
            console.error("User verification error:", error);
            setError(error.message);
            return false;
        }
    };

    const updatePassword = async (email, newPassword) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DEV_URL}/api/clients?filters[email][$eq]=${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            const userId = data.data[0].id;

            const updateRes = await fetch(`${process.env.REACT_APP_DEV_URL}/api/clients/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        password: newPassword,
                    },
                }),
            });

            if (!updateRes.ok) {
                const errorMessage = await updateRes.text();
                throw new Error(errorMessage);
            }

            return true;
        } catch (error) {
            console.error("Password update error:", error);
            setError(error.message);
            return false;
        }
    };

    const handleForgotPassword = async () => {
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match");
            return;
        }

        const userVerified = await verifyUser(email, question1, question2);
        if (!userVerified) {
            setError("The provided information does not match our records.");
            return;
        }

        const passwordUpdated = await updatePassword(email, newPassword);
        if (passwordUpdated) {
            setSuccess("Password updated successfully. You can now log in with your new password.");
            setTimeout(() => {
                navigate("/login");
            }, 2500);
        }
    };

    return (
        <div className="picture">
            <div className="wrapper">
                <form action="">
                    <div className="forgot-password-header">
                        <h1>Forgot Password</h1>
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <FaEnvelope className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="What is your favorite food?"
                            value={question1}
                            onChange={(e) => setQuestion1(e.target.value)}
                            required
                        />
                        <FaQuestionCircle className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="What is your favorite color?"
                            value={question2}
                            onChange={(e) => setQuestion2(e.target.value)}
                            required
                        />
                        <FaQuestionCircle className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <FaLock className="icon" />
                        <span 
                            className={`eye-icon ${showNewPassword ? "show" : ""}`}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="input-box">
                        <input
                            type={showConfirmNewPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        <FaLock className="icon" />
                        <span 
                            className={`eye-icon ${showConfirmNewPassword ? "show" : ""}`}
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        >
                            {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>}
                    <div className="button">
                        <button type="button" onClick={handleForgotPassword}>
                            Update Password
                        </button>
                    </div>
                    <div className="back-to-login-link">
                        <p>
                            Remembered your password?{" "}
                            <a onClick={() => navigate("/login")}>Back to Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
