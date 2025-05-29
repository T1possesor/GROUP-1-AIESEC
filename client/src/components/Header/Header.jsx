import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import Search from "./Search/Search";
import { Context } from "../../utils/context";
import Cart from "../Cart/Cart";
import Favorites from "../Favorites/Favorites";
import "./Header.scss";
import logo from "../../assets/logo1.png"; // Adjust the path as necessary

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showUserOptions, setShowUserOptions] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const { cartCount, favorites, user, setUser, setFavorites, setCartItems } = useContext(Context);
    const navigate = useNavigate();

    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 200) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleUserOptions = () => {
        setShowUserOptions(prevState => !prevState);
    };

    const handleLogout = () => {
        setUser(null);
        setFavorites([]); // Reset favorites on logout
        setCartItems([]); // Reset cart items on logout
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            <header className={`main-header ${scrolled ? "sticky-header" : ""}`}>
                <div className="header-content">
                    <ul className="left">
    <li onClick={() => navigate("/")}> 
        <img src={logo} alt="Logo" className="logo" />
        Trang chủ
    </li>
    
    <li onClick={() => navigate("/hopdong")}>Hợp đồng</li>
     <li onClick={() => navigate("/yeucau")}>
        Yêu cầu tư vấn
    </li>



    {user?.Vaitro === "Admin" && (
        <li>
            <button
                className="create-quotation-button"
                onClick={() => navigate("/baogia")}
            >
                Quản lý báo giá
            </button>
        </li>
    )}
</ul>

                    <div className="center" onClick={() => navigate("/")}>AIESEC</div>
                    <div className="right">
    {user?.Vaitro === "Admin" && (
    <div
        className="baocao-link"
        onClick={() => navigate("/baocaothongke")}
        style={{ cursor: "pointer", marginRight: "10px", fontWeight: "bold" }}
    >
        Báo cáo thống kê
    </div>
)}

{(user?.Vaitro === "Admin" || user?.Vaitro === "NhanVien") && (
    <div
        className="khachhang-link"
        onClick={() => navigate("/khachhang")}
        style={{ cursor: "pointer", marginRight: "10px" }}
    >
        Khách hàng
    </div>
)}



                        {(user?.Vaitro === "Admin" || user?.Vaitro === "NhanVien") && (
    <div
        className="khachhangtiemnang-link"
        onClick={() => navigate("/khachhangtiemnang")}
        style={{ cursor: "pointer", marginRight: "10px" }}
    >
        Khách hàng tiềm năng
    </div>
)}

                        {(user?.Vaitro === "Admin" || user?.Vaitro === "NhanVien") && (
        <div
            className="giaovien-link"
            onClick={() => navigate("/dexuatgiaovien")}
            style={{ cursor: "pointer", marginRight: "10px", fontWeight: "bold" }}
        >
            Giáo viên
        </div>
    )}
                        <div className="user-icon">
                            <AiOutlineUser onClick={toggleUserOptions} />
                            {showUserOptions && (
                                <div className="user-options">
                                    {user ? (
                                        <>
                                            <div onClick={() => navigate("/profile")}>Thông tin cá nhân</div>
                                            <div onClick={handleLogout}>Đăng xuất</div>
                                        </>
                                    ) : (
                                        <>
                                            <div onClick={() => navigate("/login")}>Đăng nhập</div>
                                            
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {user && (
                            <div className="welcome-message">
                               
                            </div>
                        )}
                        
                        
                        

                    </div>
                </div>
            </header>
            {showCart && <Cart setShowCart={setShowCart} />}
            {showSearch && <Search setShowSearch={setShowSearch} />}
            {showFavorites && <Favorites setShowFavorites={setShowFavorites} />}
        </>
    );
};

export default Header;