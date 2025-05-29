import React, { useState, useEffect, useContext } from "react";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { Context } from "../../utils/context";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import GoogleLoginComponent from "./Google";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

const Login = ({ setShowLogin }) => {
    const navigate = useNavigate();
    const { setUser } = useContext(Context);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "visible";
        };
    }, []);

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Đăng nhập thất bại");
            }

            const user = data.user;
console.log("✅ Dữ liệu user nhận về:", user); // ← Thêm dòng này
setUser(user);
localStorage.setItem('user', JSON.stringify(user));


            // 👉 Điều hướng theo vai trò
            if (user.Vaitro === 'Admin') {
                navigate("/admin");
            } else if (user.Vaitro === 'NhanVien') {
                navigate("/employee");
            } else if (user.Vaitro === 'KhachHang') {
                navigate("/home?user=" + user.Tendangnhap);
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message);
        }
    };

    const handleFacebookLogin = (response) => {
        console.log('Facebook login success:', response);
        const user = {
            id: response.id,
            username: response.name,
            email: response.email,
            picture: response.picture.data.url,
            Vaitro: 'KhachHang'
        };
        setUser(user);
        setProfile(user);
        localStorage.setItem('user', JSON.stringify(user));
        navigate(`/home?user=${user.username}`);
    };

    const handleFacebookFailure = (error) => {
        console.error('Facebook login failed:', error);
    };

    return (
        <div className="picture">
            <div className="wrapper">
                <form action="">
                    <div className="login-header">
                        <h1>Login</h1>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <FaLock className="icon" />
                        <span 
                            className={`eye-icon ${showPassword ? "show" : ""}`}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div style={{ height: "0px" }}></div>

                    {error && <div className="error">{error}</div>}
                    <div className="button">
                        <button type="button" onClick={handleLogin}>
                            Đăng nhập
                        </button>
                    </div>
                    
                   
                </form>
                {profile && (
                    <div>
                        <h1>{profile.username}</h1>
                        <img src={profile.picture} alt="Profile" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
