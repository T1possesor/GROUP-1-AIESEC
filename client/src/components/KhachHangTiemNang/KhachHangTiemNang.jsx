import React from "react";
import { useNavigate } from "react-router-dom";
import "./KhachHangTiemNang.scss";

const KhachHangTiemNang = () => {
    const navigate = useNavigate();

    return (
        <div className="khachhangtiemnang-page">
            <h1>Trang Quản Lý Khách Hàng Tiềm Năng</h1>

            <div className="options">
                <div
                    className="box"
                    onClick={() => navigate("/khachhangtiemnang/thongtin")}
                >
                    1. Quản lý thông tin khách hàng tiềm năng
                </div>

                <div
                    className="box"
                    onClick={() => navigate("/khachhangtiemnang/hoatdong")}
                >
                    2. Theo dõi hoạt động khách hàng tiềm năng
                </div>
            </div>
        </div>
    );
};

export default KhachHangTiemNang;
