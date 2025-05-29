import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import HopDong from "./components/HopDong/HopDong";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Category from "./components/Category/Category";
import SingleProduct from "./components/SingleProduct/SingleProduct";
import Newsletter from "./components/Footer/Newsletter/Newsletter";
import AppContext from "./utils/context";
import About from "./components/About/About";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import Favorites from "./components/Favorites/Favorites";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import AdminPage from "./components/AdminPage/AdminPage";
import EmployeePage from "./components/EmployeePage/EmployeePage";
import BaoGia from "./components/BaoGia/BaoGia";
import YeuCauTuVan from "./components/YeuCauTuVan/YeuCauTuVan";
import KhachHang from "./components/KhachHang/KhachHang";
import ThongTinKhachHang from "./components/KhachHang/ThongTinKhachHang";
import HoatDongKhachHang from "./components/KhachHang/HoatDongKhachHang";
import KhachHangTiemNang from "./components/KhachHangTiemNang/KhachHangTiemNang";
import ThongTinTiemNang from "./components/KhachHangTiemNang/ThongTinTiemNang";
import HoatDongTiemNang from "./components/KhachHangTiemNang/HoatDongTiemNang";
import DeXuatGiaoVien from "./components/DeXuatGiaoVien/DeXuatGiaoVien";
import BaoCaoThongKe from "./components/BaoCaoThongKe/BaoCaoThongKe";

function AppContent() {
    const location = useLocation();

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/category/:id" element={<Category />} />
                <Route path="/product/:id" element={<SingleProduct />} />
                <Route path="/about" element={<About />} />
                <Route path="/hopdong" element={<HopDong />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/employee" element={<EmployeePage />} />
                <Route path="/baogia" element={<BaoGia />} />
                <Route path="/yeucau" element={<YeuCauTuVan />} />
                <Route path="/khachhang/thongtin" element={<ThongTinKhachHang />} />
                <Route path="/khachhang/hoatdong" element={<HoatDongKhachHang />} />
                <Route path="/khachhang" element={<KhachHang />} />
                <Route path="/khachhangtiemnang" element={<KhachHangTiemNang />} />
                <Route path="/khachhangtiemnang/hoatdong" element={<HoatDongTiemNang />} />
                <Route path="/khachhangtiemnang/thongtin" element={<ThongTinTiemNang />} />
                <Route path="/dexuatgiaovien" element={<DeXuatGiaoVien />} />
                <Route path="/baocaothongke" element={<BaoCaoThongKe />} />

            </Routes>

            {!location.pathname.startsWith("/hopdong") &&
 !location.pathname.startsWith("/khachhang") &&
 !location.pathname.startsWith("/baogia") &&
 location.pathname !== "/dexuatgiaovien" &&
 location.pathname !== "/baocaothongke" &&
 location.pathname !== "/yeucau" && (       // ✅ Thêm dòng này
    <Newsletter />
)}





            <Footer />
        </>
    );
}

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <AppContext>
                    <AppContent />
                </AppContext>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;
