import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../utils/context";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Profile.scss";

const Profile = () => {
    const { user, setUser } = useContext(Context);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!user) {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
                setUser(storedUser);
            }
        }
    }, [user, setUser]);

    const handleChangePassword = async () => {
        setError(null);
        setSuccess(null);

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError("Mật khẩu mới không trùng khớp.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/check-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Nguoidung: user.ID_KH,
                    Matkhau: currentPassword
                })
            });

            const check = await res.json();
            if (!check.success) {
                setError("Mật khẩu hiện tại không đúng.");
                return;
            }

            const update = await fetch("http://localhost:5000/api/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Nguoidung: user.ID_KH,
                    Matkhau: newPassword
                })
            });

            const result = await update.json();
            if (result.success) {
                setSuccess("Đổi mật khẩu thành công!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                setError("Đổi mật khẩu thất bại.");
            }
        } catch (err) {
            console.error("❌ Lỗi đổi mật khẩu:", err);
            setError("Có lỗi xảy ra.");
        }
    };

    if (!user) return <div style={{ padding: "2rem" }}>Đang tải thông tin...</div>;

    return (
        <div className="profile-container">
            <div className="profile-page">
                <h1>Thông Tin Cá Nhân</h1>
                <div className="profile-info">
                    <p><strong>Tên đăng nhập:</strong> {user.Tendangnhap}</p>
                    <p><strong>Email:</strong> {user.Email}</p>
                </div>

                <div className="change-password">
                    <h2>Đổi mật khẩu</h2>

                    <div className="input-box">
                        <span className="password-toggle-icon" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Mật khẩu hiện tại"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div className="input-box">
                        <span className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="input-box">
                        <span className="password-toggle-icon" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        <input
                            type={showConfirmNewPassword ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>}

                    <button className="save-button" onClick={handleChangePassword}>Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
