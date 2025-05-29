import React, { useContext, useEffect } from "react";
import { Context } from "../../utils/context";
import { useNavigate } from "react-router-dom";
import "./EmployeePage.scss";

const EmployeePage = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.Vaitro !== 'NhanVien') {
            navigate('/'); // Điều hướng về trang chủ nếu không phải nhân viên
        }
    }, [user, navigate]);

    return (
        <div className="employee-page">
            <header className="employee-header">
                <h1>Xin chào Nhân viên</h1>
            </header>
            <main className="employee-content">
                <p>Chào mừng bạn đến với giao diện dành cho nhân viên.</p>
            </main>
        </div>
    );
};

export default EmployeePage;
