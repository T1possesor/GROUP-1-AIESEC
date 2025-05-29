import React, { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Home.scss";
import Banner from "./Banner/Banner";
import Category from "./Category/Category";
import { fetchDataFromApi } from "../../utils/api";
import { Context } from "../../utils/context";

const Home = () => {
    const { categories, setCategories, setUser } = useContext(Context);
    const location = useLocation();

    useEffect(() => {
        getCategories();

        const searchParams = new URLSearchParams(location.search);
        const username = searchParams.get("user");
        if (username) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.username === username) {
                setUser(storedUser);
            }
        }
    }, []);

    const getCategories = () => {
        fetchDataFromApi("/api/categories?populate=*").then((res) => {
            console.log(res);
            setCategories(res);
        });
    };

    return (
        <div>
            <Banner />
            <div className="global-teacher-info">
    <h2>VỀ GLOBAL TEACHER</h2>
    <p>
        <span className="highlight">Global Teacher - <i>chương trình Giáo viên toàn cầu</i></span> là cầu nối giữa nguồn nhân lực trẻ, năng động đến từ nhiều quốc gia trên thế giới và những trung tâm, cơ sở Anh ngữ đang tìm kiếm nguồn giáo viên giảng dạy Tiếng Anh có kinh nghiệm và phương pháp giảng dạy quốc tế, hiệu quả.
    </p>

    <h2 className="section-title">ĐIỂM KHÁC BIỆT CỦA CHÚNG TÔI</h2>
    <div className="features">
        <div className="feature-box">
            <div className="icon">👁</div>
            <h3>Theo sát giáo viên</h3>
            <p>Hệ thống "bạn đồng hành - buddy" hỗ trợ ứng viên từ giai đoạn ứng tuyển đến khi kết thúc hành trình làm việc tại công ty. Từ đó, AIESEC đóng vai trò cầu nối phát triển, gắn kết mối quan hệ giữa doanh nghiệp và giảng viên.</p>
        </div>
        <div className="feature-box">
            <div className="icon">📋</div>
            <h3>Bảo hành hợp đồng</h3>
            <p>Quy định rõ ràng về thời hạn bảo hành nhân sự nhằm đảm bảo quyền lợi cho đối tác đồng hành kiến tạo giá trị cùng AIESEC.</p>
        </div>
        <div className="feature-box">
            <div className="icon">📣</div>
            <h3>Tuyển dụng tại nguồn</h3>
            <p>Đồng hành cùng AIESEC kiến tạo giá trị giáo dục khác biệt cho Việt Nam và doanh nghiệp thông qua "leadership - kỹ năng lãnh đạo".</p>
        </div>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
<div className="benefits-section">
    <h2 className="section-title">LỢI ÍCH CHÚNG TÔI MANG LẠI</h2>
     <div className="benefits-subtitle">
        LỢI ÍCH CHÚNG TÔI MANG LẠI
    </div>
    <div className="benefits-content">
        <div className="benefits-image">
            <img
                src="https://cdn.prod.website-files.com/612b7de9c64ea455b27fc10e/64809a29b3dfc88c1ba498e2_feature-gte-2.png"
                alt="Global Teacher Benefits"
            />
        </div>

        <div className="benefits-items">
            <div className="benefit">
                <img
                    src="https://cdn.prod.website-files.com/612b7de9c64ea455b27fc10e/64809a280a92ccf749ac7b99_Thu%20hu%CC%81t%20nha%CC%82n%20ta%CC%80i.png"
                    alt="Human Resource Icon"
                />
                <div>
                    <h3>Nguồn nhân lực trẻ chất lượng</h3>
                    <p>Cơ hội tiếp cận nguồn giảng viên trẻ quốc tế, năng động và có phương pháp, kinh nghiệm giảng dạy hiệu quả</p>
                </div>
            </div>

            <div className="benefit">
                <img
                    src="https://cdn.prod.website-files.com/612b7de9c64ea455b27fc10e/64809a26e6895ba2a012ea05_Ta%CC%86ng%20cu%CC%9Bo%CC%9B%CC%80ng%20lo%CC%9B%CC%A3i%20the%CC%82%CC%81%20ca%CC%A3nh%20tranh.png"
                    alt="Competitive Icon"
                />
                <div>
                    <h3>Tăng cường lợi thế cạnh tranh</h3>
                    <p>Giải pháp kiến tạo giá trị giáo dục bằng kinh nghiệm từ giảng viên và kỹ năng lãnh đạo được theo sát và có quy trình từ AIESEC</p>
                </div>
            </div>

            <div className="benefit">
                <img
                    src="https://cdn.prod.website-files.com/612b7de9c64ea455b27fc10e/64809a25d425bdd22ce5d8a0_Mo%CC%82i%20tru%CC%9Bo%CC%9B%CC%80ng%20ho%CC%A3c%20ta%CC%A3%CC%82p%20va%CC%80%20la%CC%80m%20vie%CC%A3%CC%82c%20%C4%91a%20va%CC%86n%20ho%CC%81a.png"
                    alt="Diversity Icon"
                />
                <div>
                    <h3>Môi trường học tập đa văn hóa</h3>
                    <p>Thực hiện hóa khả năng tiếp cận, trao đổi với nhiều nền văn hóa bằng Tiếng Anh ngay chính môi trường giảng dạy</p>
                </div>
            </div>
        </div>
    </div>

    <div className="cta-button">
    <button
        onClick={() =>
            window.scrollTo({ top: 2251, left: 0, behavior: "smooth" })
        }
    >
        Đăng ký nhận tư vấn
    </button>
</div>

</div>

<br></br>
<br></br>
<br></br>


</div>

        </div>
    );
};

export default Home;
