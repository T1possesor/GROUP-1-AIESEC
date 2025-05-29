import React from "react";
import { useNavigate } from "react-router-dom";
import "./KhachHang.scss";

const KhachHang = () => {
    const navigate = useNavigate();

    return (
        <div className="khachhang-page">
            <h1>Trang Quản Lý Khách Hàng</h1>

            <div className="options">
                <div
                    className="box"
                    onClick={() => navigate("/khachhang/thongtin")}
                >
                    1. Quản lý thông tin khách hàng
                </div>

                <div
                    className="box"
                    onClick={() => navigate("/khachhang/hoatdong")}
                >
                    2. Quản lý hoạt động khách hàng
                </div>
            </div>
        </div>
    );
};

export default KhachHang;
