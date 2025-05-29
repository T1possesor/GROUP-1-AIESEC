import React, { useState, useContext } from "react";
import { Context } from "../../../utils/context";

import "./Newsletter.scss";

const Newsletter = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        note: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const { user } = useContext(Context); // lấy từ context

const handleSubmit = async (e) => {
    e.preventDefault();

    // Tự xác định "nguon" dựa theo tài khoản
    const nguon = user?.Vaitro === "KhachHang" ? "taikhoan" : "guest";

    try {
        const response = await fetch("http://localhost:5000/api/yeucau", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                note: formData.note,
                nguon: nguon,
                taoBoi: user?.ID_KH || "Khách" // 👈 Gửi ID_KH vào backend
            })
        });

        const result = await response.json();
        if (result.success) {
            alert("✅ Yêu cầu đã được gửi thành công!");
            setFormData({
                name: "",
                email: "",
                phone: "",
                note: ""
            });
            window.dispatchEvent(new Event("yeucau-updated"));
        } else {
            alert("❌ Gửi thất bại: " + result.message);
        }
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("❌ Đã xảy ra lỗi khi gửi yêu cầu.");
    }
};





    

    return (
        <div className="newsletter-section">
            <div className="newsletter-content">
                <span className="big-text">Đăng ký tư vấn</span>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Tên khách hàng"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="note"
                        placeholder="Ghi chú"
                        value={formData.note}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                    <button type="submit">Gửi thông tin</button>
                </form>
            </div>
        </div>
    );
};

export default Newsletter;
