import React, { useState, useEffect, useContext } from "react";
import { FaLock, FaUser, FaEnvelope, FaQuestionCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Context } from "../../utils/context";
import "./Register.scss";
import { useNavigate } from "react-router-dom";

const Register = ({ setShowRegister }) => {
    const navigate = useNavigate();
    const { setUser } = useContext(Context);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [question1, setQuestion1] = useState("");
    const [question2, setQuestion2] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [capsLock, setCapsLock] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "visible";
        };
    }, []);

    const handleKeyUp = (event) => {
        if (event.getModifierState("CapsLock")) {
            setCapsLock(true);
        } else {
            setCapsLock(false);
        }
    };

    const checkEmailExists = async (email) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DEV_URL}/api/clients?filters[email][$eq]=${email}`, {
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
            console.error("Email check error:", error);
            setError(error.message);
            return false;
        }
    };

    const handleRegister = async () => {
        setError(null);

        if (!username || !email || !password || !confirmPassword || !question1 || !question2) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            setError("Email has already been registered");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_DEV_URL}/api/clients`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        username,
                        email,
                        password,
                        question1,
                        question2,
                    },
                }),
            });

            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(errorMessage);
            }

            const data = await res.json();
            const newUser = data.data[0]?.attributes;
            if (newUser) {
                setUser(newUser);
                setShowRegister(false);
                navigate("/");
            } else {
                setError("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message);
        }
    };

    return (
        <div className="picture">
            <div className="wrapper">
                <form action="">
                    <div className="register-header">
                        <h1>Register</h1>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            onKeyUp={handleKeyUp}
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            onKeyUp={handleKeyUp}
                        />
                        <FaEnvelope className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            onKeyUp={handleKeyUp}
                        />
                        <FaLock className="icon" />
                        <span 
                            className={`eye-icon ${showPassword ? "show" : ""}`}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="input-box">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            onKeyUp={handleKeyUp}
                        />
                        <FaLock className="icon" />
                        <span 
                            className={`eye-icon ${showConfirmPassword ? "show" : ""}`}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="What is your favorite food"
                            value={question1}
                            onChange={(e) => setQuestion1(e.target.value)}
                            required
                            onKeyUp={handleKeyUp}
                        />
                        <FaQuestionCircle className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="What is your favorite color"
                            value={question2}
                            onChange={(e) => setQuestion2(e.target.value)}
                            required
                            onKeyUp={handleKeyUp}
                        />
                        <FaQuestionCircle className="icon" />
                    </div>
                    {capsLock && <div className="caps-lock-warning">Caps Lock is on</div>}
                    {error && <div className="error">{error}</div>}
                    <div className="button">
                        <button type="button" onClick={handleRegister}>
                            Register
                        </button>
                    </div>
                    <div className="register-link">
                        <p>
                            Already have an account?{" "}
                            <a onClick={() => navigate("/login")}>Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
