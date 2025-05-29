import React, { useContext, useEffect } from "react";
import { Context } from "../../utils/context";
import { useNavigate } from "react-router-dom";
import "./AdminPage.scss";

const AdminPage = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.Vaitro !== 'Admin') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="admin-page">
            <header className="admin-header">
                <h1>Xin chào Admin</h1>
            </header>
            <main className="admin-content">
                <p>Chào mừng bạn đến với giao diện quản trị.</p>
            </main>
        </div>
    );
};

export default AdminPage;
