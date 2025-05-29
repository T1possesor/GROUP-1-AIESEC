import React from "react";
import "./Footer.scss";
import { FaLocationArrow, FaMobileAlt, FaEnvelope } from "react-icons/fa";
import Payment from "../../assets/payments.png";
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="col">
                    <div className="title">About</div>
                    <div className="text">Chào mừng bạn đến với dịch vụ của AIESEC!
Chúng tôi cam kết mang đến cho bạn dịch vụ khách hàng tuyệt vời nhất.
Đội ngũ của AIESEC luôn nhiệt huyết trong việc đảm bảo chất lượng và mang lại cho bạn một trải nghiệm tuyệt vời.
Cảm ơn bạn đã tin tưởng và lựa chọn AIESEC!
                    </div>
                </div>
                <div className="col">
                    <div className="title">Contact</div>
                    <div className="c-items">
                       <FaLocationArrow/> 
                       <div className="text">
                       279 Đ. Nguyễn Tri Phương, Phường 5, Quận 10, Hồ Chí Minh
                            </div>
                    </div>
                    <div className="c-items">
                       <FaMobileAlt/> 
                       <div className="text">
                       Phone: 028 3822 9272
                            </div>
                    </div>
                    <div className="c-items">
                       <FaEnvelope/> 
                       <div className="text">
                       Email: AIESEC@gmail.com
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="title">Danh mục</div>
                    <span className="text">Hợp đồng</span>
                    <span className="text">Yêu cầu tư vấn</span>
                    
                </div>
                <div className="col">
    <div className="title">Trang</div>
    <span className="text">Trang chủ</span>
    <span className="text">Giới thiệu</span>
    <span className="text">Chính sách bảo mật</span>
    <span className="text">Chính sách đổi trả</span>
    <span className="text">Điều khoản & Điều kiện</span>
    <span className="text">Liên hệ</span>
</div>

             </div>
             <div className="bottom-bar">
                <div className="bottom-bar-content">
                    <div className="text">
                        AIESEC 2025 CREATED BY GROUP 1.
                    </div>
                    <img src={Payment} />
                </div>
             </div>
    </footer>
    );
};

export default Footer;
