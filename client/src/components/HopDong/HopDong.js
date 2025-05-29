import React, { useContext, useEffect, useState } from "react";
import "./HopDong.scss";
import { Context } from "../../utils/context";
import axios from "axios";


const HopDong = () => {
    const [phanHoiText, setPhanHoiText] = useState("");
const [phanHoiFor, setPhanHoiFor] = useState(null); // ID_DG cần phản hồi

    const { user, setUser } = useContext(Context);
    const [hopDongs, setHopDongs] = useState([]);
    const [danhGias, setDanhGias] = useState([]);
    const [showRatingFor, setShowRatingFor] = useState(null);
    const [ratingText, setRatingText] = useState("");
    const [ratingStars, setRatingStars] = useState(0);
    const [selectedReview, setSelectedReview] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newTenHDong, setNewTenHDong] = useState("");
    const [newGiaTri, setNewGiaTri] = useState("");
    const [newNgayBatDau, setNewNgayBatDau] = useState("");
    const [newNgayKetThuc, setNewNgayKetThuc] = useState("");
    const [phanHois, setPhanHois] = useState([]);
    const [notifySuccess, setNotifySuccess] = useState(false);
    const [showPaymentFor, setShowPaymentFor] = useState(null);
    
const [paymentInfo, setPaymentInfo] = useState({
    method: "",
    cardNumber: "",
});
const [paymentResult, setPaymentResult] = useState(null);


    const [newID_KH, setNewID_KH] = useState("");
    const handleAddContract = async () => {
    if (!newTenHDong || !newGiaTri || !newNgayBatDau || !newNgayKetThuc || !newID_KH) {
        alert("Vui lòng nhập đầy đủ thông tin hợp đồng!");
        return;
    }

    const payload = {
        TenHDong: newTenHDong,
        GiatriHDong: parseFloat(newGiaTri),
        Ngaybatdau: newNgayBatDau,
        Ngayketthuc: newNgayKetThuc,
        ID_KH: newID_KH,
        ID_NV: user.ID_Nguoidung || user.ID_NV || "",
        TaoBoi: user.Tendangnhap
    };

    try {
        const res = await axios.post("http://localhost:5000/api/hopdong", payload);
        if (res.data.success) {
            alert("✅ Đã thêm hợp đồng!");
            setNewTenHDong("");
            setNewGiaTri("");
            setNewNgayBatDau("");
            setNewNgayKetThuc("");
            setNewID_KH("");

            const reload = await axios.get("http://localhost:5000/api/hopdong/all");
            if (reload.data.success) setHopDongs(reload.data.data);
        } else {
            alert("❌ Thêm hợp đồng thất bại!");
        }
    } catch (err) {
        console.error("❌ Lỗi khi thêm hợp đồng:", err);
    }
};



    useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    setUser(storedUser);

    // ✅ Luôn lấy danh sách phản hồi, bất kể vai trò là gì
    axios.get("http://localhost:5000/api/phanhoi/all")
        .then(res => {
            if (res.data.success) setPhanHois(res.data.data);
        })
        .catch(err => {
            console.error("❌ Lỗi khi lấy phản hồi:", err);
        });

    if (storedUser.Vaitro === "Admin" || storedUser.Vaitro === "NhanVien") {
        axios.get("http://localhost:5000/api/hopdong/all")
            .then(res => {
                if (res.data.success) {
                    setHopDongs(res.data.data);
                }
            })
            .catch(err => {
                console.error("❌ Lỗi khi lấy tất cả hợp đồng:", err);
            });

        axios.get("http://localhost:5000/api/danhgia/all")
            .then(res => {
                if (res.data.success) {
                    setDanhGias(res.data.data);
                }
            })
            .catch(err => {
                console.error("❌ Lỗi khi lấy tất cả đánh giá:", err);
            });

    } else if (storedUser.ID_KH) {
        axios.get(`http://localhost:5000/api/hopdong/${storedUser.ID_KH}`)
            .then(res => {
                if (res.data.success) {
                    setHopDongs(res.data.data);
                }
            })
            .catch(err => {
                console.error("❌ Lỗi khi lấy hợp đồng cá nhân:", err);
            });

        axios.get(`http://localhost:5000/api/danhgia/${storedUser.ID_KH}`)
            .then(res => {
                if (res.data.success) {
                    setDanhGias(res.data.data);
                }
            })
            .catch(err => {
                console.error("❌ Lỗi khi lấy đánh giá cá nhân:", err);
            });
    }
}, [user, setUser]);


    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN");
    };
    const handleUpdateStatus = async (id, newStatus) => {
    try {
        const res = await axios.put(`http://localhost:5000/api/hopdong/update-status/${id}`, {
            Trangthai: newStatus,
            ChinhSuaLanCuoiBoi: user.Tendangnhap
        });

        if (res.data.success) {
            alert("✅ Đã cập nhật trạng thái!");
            // Gọi lại API để cập nhật danh sách hợp đồng
            const reload = await axios.get("http://localhost:5000/api/hopdong/all");
            if (reload.data.success) setHopDongs(reload.data.data);
        }
    } catch (err) {
        console.error("❌ Lỗi khi cập nhật trạng thái:", err);
        alert("Cập nhật thất bại!");
    }
};

const handleSubmitPhanHoi = async (idDG) => {
    if (!phanHoiText) {
        alert("Vui lòng nhập nội dung phản hồi");
        return;
    }

    const ID_NV = user.ID_Nguoidung || user.ID_NV;
    if (!ID_NV) {
        alert("Không xác định được ID nhân viên để phản hồi.");
        return;
    }

    const payload = {
        ID_DG: idDG,
        ID_NV: ID_NV,
        Noidung: phanHoiText,
        TaoBoi: user.Tendangnhap,
    };

    try {
        const res = await axios.post("http://localhost:5000/api/phanhoi", payload);
        if (res.data.success) {
            alert("✅ Đã gửi phản hồi!");
            setPhanHoiText("");
            setPhanHoiFor(null);

            // ✅ Gọi lại API để cập nhật cả danh sách đánh giá và phản hồi ngay lập tức
            const [reloadDanhGia, reloadPhanHoi] = await Promise.all([
                axios.get("http://localhost:5000/api/danhgia/all"),
                axios.get("http://localhost:5000/api/phanhoi/all")
            ]);

            if (reloadDanhGia.data.success) setDanhGias(reloadDanhGia.data.data);
            if (reloadPhanHoi.data.success) setPhanHois(reloadPhanHoi.data.data);

        } else {
            alert("❌ Phản hồi thất bại.");
        }
    } catch (err) {
        console.error("❌ Lỗi khi gửi phản hồi:", err);
        alert("Gửi phản hồi thất bại.");
    }
};




    const handleSubmitRating = async (idHopDong) => {
        if (!ratingText || ratingStars < 1 || ratingStars > 5) {
            alert("Vui lòng nhập đánh giá hợp lệ (nội dung và 1–5 sao)");
            return;
        }


        const payload = {
            ID_KH: user.ID_KH,
            ID_HDong: idHopDong,
            Noidung: ratingText,
            Sosao: ratingStars,
            TaoBoi: user.Tendangnhap
        };

        try {
            const res = await axios.post("http://localhost:5000/api/danhgia", payload);
            if (res.data.success) {
                alert("Đánh giá thành công!");
                setShowRatingFor(null);
                setRatingText("");
                setRatingStars(0);

                const refresh = await axios.get(`http://localhost:5000/api/danhgia/${user.ID_KH}`);
                if (refresh.data.success) setDanhGias(refresh.data.data);
            } else {
                alert("Lỗi khi gửi đánh giá.");
            }
        } catch (err) {
            console.error("❌ Lỗi đánh giá:", err);
            alert("Gửi đánh giá thất bại.");
        }
    };
    const handleNotifyEmail = async (idKH, tenHDong) => {
    const confirm = window.confirm(`Bạn có chắc muốn gửi thông báo nhắc nhở thanh toán cho khách hàng về hợp đồng "${tenHDong}" không?`);
    if (!confirm) return;

    try {
        const res = await axios.get(`http://localhost:5000/api/email-from-idkh/${idKH}`);
        if (res.data.success) {
            const email = res.data.email;
            alert(`📧 Đã gửi thông báo đến ${email} về hợp đồng '${tenHDong}'`);
            setNotifySuccess(true);
            setTimeout(() => setNotifySuccess(false), 3000);
        } else {
            alert("❌ Không lấy được email.");
        }
    } catch (err) {
        console.error("❌ Lỗi khi gửi thông báo:", err);
        alert("Gửi thông báo thất bại.");
    }
};




    const filteredHopDongs = hopDongs.filter(hd =>
        hd.TenHDong.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!user || hopDongs.length === 0) {
        return <p style={{ padding: "2rem", textAlign: "center" }}>Không có hợp đồng nào được tìm thấy.</p>;
    }

    return (
        <div className="hopdong-page">
            <h1>Hợp Đồng Của Bạn</h1>
            {/* 🔽 FORM THÊM HỢP ĐỒNG - chỉ hiển thị cho Admin/Nhân viên */}
            {(user.Vaitro === "Admin" || user.Vaitro === "NhanVien") && (
                <div className="form-add-contract card">
    <h3>Thêm Hợp Đồng Mới</h3>
    <div className="form-group">
        <label>Tên hợp đồng</label>
        <input type="text" value={newTenHDong} onChange={(e) => setNewTenHDong(e.target.value)} />
    </div>
    <div className="form-group">
        <label>Giá trị hợp đồng</label>
        <input type="number" value={newGiaTri} onChange={(e) => setNewGiaTri(e.target.value)} />
    </div>
    <div className="form-group">
        <label>Ngày bắt đầu</label>
        <input type="date" value={newNgayBatDau} onChange={(e) => setNewNgayBatDau(e.target.value)} />
    </div>
    <div className="form-group">
        <label>Ngày kết thúc</label>
        <input type="date" value={newNgayKetThuc} onChange={(e) => setNewNgayKetThuc(e.target.value)} />
    </div>
    <div className="form-group">
        <label>ID Khách hàng</label>
        <input type="text" value={newID_KH} onChange={(e) => setNewID_KH(e.target.value)} />
    </div>
    <button className="submit-button" onClick={handleAddContract}>➕ Thêm hợp đồng</button>
</div>

            )}

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Tìm theo tên hợp đồng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "8px",
                        width: "60%",
                        maxWidth: "400px",
                        border: "1px solid #ccc",
                        borderRadius: "6px"
                    }}
                />
            </div>

            <table className="contract-table">
                <thead>
                    <tr>
                        <th>Tên hợp đồng</th>
                        <th>Giá trị</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Đánh giá</th>
                        <th>Phản hồi</th>
                        {(user.Vaitro === "Admin" || user.Vaitro === "NhanVien") && <th>Thông báo</th>}


                    </tr>
                </thead>
                <tbody>
    {filteredHopDongs.length === 0 ? (
        <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "red" }}>
                Không có hợp đồng hợp lệ
            </td>
        </tr>
    ) : (
        filteredHopDongs.map((hd, index) => {
            const danhGia = danhGias.find(dg => dg.ID_HDong === hd.ID_HDong);
            return (
                <React.Fragment key={index}>
                    <tr>
                        <td>{hd.TenHDong}</td>
                        <td>{hd.GiatriHDong.toLocaleString()}₫</td>
                        <td>{formatDate(hd.Ngaybatdau)}</td>
                        <td>{formatDate(hd.Ngayketthuc)}</td>
                        <td>
                            {(user.Vaitro === "Admin" || user.Vaitro === "NhanVien") ? (
                                <select
                                    value={hd.Trangthai}
                                    onChange={(e) => handleUpdateStatus(hd.ID_HDong, e.target.value)}
                                    style={{ padding: "4px", borderRadius: "4px" }}
                                >
                                    <option value="Chờ duyệt">Chờ duyệt</option>
                                    <option value="Đang hiệu lực">Đang hiệu lực</option>
                                    <option value="Đã kết thúc">Đã kết thúc</option>
                                </select>
                            ) : (
                                hd.Trangthai
                            )}
                        </td>
                        <td>
    {danhGia ? (
        <>
            <div><strong>Đã đánh giá:</strong></div>
            <div style={{ color: "gold" }}>{"★".repeat(danhGia.Sosao)}</div>
            <div style={{ fontStyle: "italic" }}>
                {danhGia.Noidung.slice(0, 30)}...
                <button
                    style={{ marginLeft: 8, fontSize: 12 }}
                    onClick={() => setSelectedReview(danhGia)}
                >
                    Xem chi tiết
                </button>
                
            </div>
        </>
    ) : (
        (user.Vaitro === "Admin" || user.Vaitro === "NhanVien") ? (
            <div style={{ fontStyle: "italic", color: "#888" }}>Chưa có đánh giá</div>
        ) : (
            <button onClick={() => setShowRatingFor(hd.ID_HDong)}>Đánh giá</button>
        )
    )}
</td>
<td>
  {danhGia ? (() => {
    const phanHoi = phanHois.find(ph => ph.ID_DG === danhGia.ID_DG);
    if (phanHoi) {
      // ✅ Nếu đã có phản hồi → hiện nội dung phản hồi
      return (
        <div style={{ fontStyle: "italic", color: "#333" }}>
          <div>{phanHoi.Noidung}</div>
          <div style={{ fontSize: 12, color: "#888" }}>({phanHoi.TaoBoi})</div>
        </div>
      );
    } else if (user.Vaitro === "Admin" || user.Vaitro === "NhanVien") {
      // ✅ Nếu chưa có phản hồi → cho phép phản hồi
      return (
        <button
          style={{
            fontSize: 12,
            color: "#007bff",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
          onClick={() => setPhanHoiFor(danhGia.ID_DG)}
        >
          ➕ Phản hồi
        </button>
      );
    } else {
      return <div style={{ color: "#aaa", fontStyle: "italic" }}>Chưa phản hồi</div>;
    }
  })() : (
    <div style={{ color: "#aaa", fontStyle: "italic" }}>–</div>
  )}
</td>
<td>
  {user.Vaitro === "KhachHang" && (
    <button
      onClick={() => setShowPaymentFor(hd)}
      style={{
        fontSize: 12,
        border: "1px solid #007bff",
        background: "none",
        padding: "4px",
        borderRadius: "6px",
        cursor: "pointer",
        color: "#007bff",
        marginTop: "5px"
      }}
    >
      💳 Thanh toán
    </button>
  )}
</td>

{(user.Vaitro === "Admin" || user.Vaitro === "NhanVien") && (
  <td>
    <button
      onClick={() => handleNotifyEmail(hd.ID_KH, hd.TenHDong)}
      style={{
        fontSize: 12,
        background: "none",
        border: "1px solid #28a745",
        borderRadius: "6px",
        padding: "4px",
        cursor: "pointer",
        color: "#28a745"
      }}
    >
      Gửi thông báo
    </button>
  </td>
)}








                    </tr>
                    {phanHoiFor === danhGia?.ID_DG && (
    <tr>
        <td colSpan="6">
            <div className="phanhoi-box" style={{ marginTop: "10px" }}>
                <textarea
                    placeholder="Nhập nội dung phản hồi..."
                    value={phanHoiText}
                    onChange={(e) => setPhanHoiText(e.target.value)}
                    style={{ width: "100%", height: "60px", marginBottom: "10px" }}
                />
                <button onClick={() => handleSubmitPhanHoi(danhGia.ID_DG)}>Gửi phản hồi</button>
                <button onClick={() => setPhanHoiFor(null)} style={{ marginLeft: "10px" }}>Hủy</button>
            </div>
        </td>
    </tr>
)}

                    {!danhGia && showRatingFor === hd.ID_HDong && (
                        <tr>
                            <td colSpan="6">
                                <div className="rating-box">
                                    <div className="stars" style={{ marginBottom: "10px" }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={star <= ratingStars ? "filled" : "empty"}
                                                onClick={() => setRatingStars(star)}
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "20px",
                                                    color: star <= ratingStars ? "gold" : "gray"
                                                }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Nhập nội dung đánh giá..."
                                        value={ratingText}
                                        onChange={(e) => setRatingText(e.target.value)}
                                        style={{ width: "100%", height: "60px", marginBottom: "10px" }}
                                    />
                                    <button onClick={() => handleSubmitRating(hd.ID_HDong)}>Gửi đánh giá</button>
                                    <button onClick={() => setShowRatingFor(null)} style={{ marginLeft: "10px" }}>Hủy</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            );
        })
    )}
</tbody>

            </table>

{selectedReview && (
    <div className="review-popup" style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 999,
        width: "90%",
        maxWidth: "500px"
    }}>
        <h3>Chi tiết đánh giá</h3>
        <div style={{ color: "gold", marginBottom: 10 }}>
            {"★".repeat(selectedReview.Sosao)}
        </div>
        <p style={{
            marginBottom: 20,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap"
        }}>
            {selectedReview.Noidung}
        </p>
        <button onClick={() => setSelectedReview(null)}>Đóng</button>
    </div>
)}

{showPaymentFor && (
  <div className="payment-modal">
    <div className="payment-content">
      <h2>💳 Thanh toán hợp đồng</h2>
      <p><strong>Tên:</strong> {showPaymentFor.TenHDong}</p>
      <p><strong>Giá trị:</strong> {showPaymentFor.GiatriHDong.toLocaleString()}₫</p>

      <label>Phương thức thanh toán:</label>
      <select
        value={paymentInfo.method}
        onChange={(e) => setPaymentInfo({ ...paymentInfo, method: e.target.value })}
      >
        <option value="">-- Chọn --</option>
        <option value="Visa">Visa</option>
        <option value="Momo">Momo</option>
      </select>

      <label>Số thẻ / tài khoản:</label>
      <input
        type="text"
        placeholder="Nhập số tài khoản/thẻ..."
        value={paymentInfo.cardNumber}
        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
      />

      {paymentResult && (
        <div className={`result-message ${paymentResult.includes("thành công") ? "success" : "error"}`}>
          {paymentResult}
        </div>
      )}

      <div className="button-group">
        <button className="confirm" onClick={() => {
          if (!paymentInfo.method || !paymentInfo.cardNumber) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
          }
          const isSuccess = Math.random() > 0.3;
          setPaymentResult(isSuccess ? "✅ Thanh toán thành công!" : "❌ Thanh toán thất bại. Vui lòng thử lại.");
        }}>
          Xác nhận
        </button>

        <button className="cancel" onClick={() => {
          setShowPaymentFor(null);
          setPaymentInfo({ method: "", cardNumber: "" });
          setPaymentResult(null);
        }}>
          Hủy
        </button>
      </div>
    </div>
  </div>
)}


</div> // đóng thẻ hopdong-page
);

};

export default HopDong;
