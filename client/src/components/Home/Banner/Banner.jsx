import "./Banner.scss";
import BannerImg from "../../../assets/pic11.png";
import { useNavigate } from "react-router-dom";

const Banner = () => {
    const navigate = useNavigate();
    return (
        <div className="hero-banner">
            <div className="content">
                {/* Di chuyển logo lên đầu */}
                <img className="pic11" src={BannerImg} alt="" />
                
                <div className="text-content">
                    <h1>Global Teacher</h1>
                     <h1>Giáo viên toàn cầu</h1>
                    <p>
                        Cơ hội để doanh nghiệp kiến tạo giá trị giáo dục và xã hội
                        cùng giảng viên quốc tế và AIESEC.
                    </p>
                    <div className="ctas">
                        <div
  className="banner-cta"
  onClick={() =>
    window.scrollTo({ top: 840, left: 0, behavior: "smooth" }) // 👈 chỉnh số pixel tùy vị trí bạn muốn scroll tới
  }
>
  Tìm hiểu ngay
</div>

                        <div
                            className="banner-cta v2"
                            onClick={() =>
                                window.scrollTo({ top: 2251, left: 0, behavior: "smooth" })
                            }
                        >
                            Đăng ký nhận tư vấn
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
