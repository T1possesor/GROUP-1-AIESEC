import React, { useEffect, useState } from "react";
import "./YeuCauTuVan.scss";

const YeuCauTuVan = () => {
    const [yeuCau, setYeuCau] = useState([]);
    const [user, setUser] = useState(null);
    const [ghiChu, setGhiChu] = useState({});
    const chuaXuLy = yeuCau.filter(item => item.TrangThaiYeuCau === "Chưa xử lý");
const daXuLy = yeuCau.filter(
  item =>
    item.IDNhanVienTiepNhan === (user?.ID_NV || user?.ID_Nguoidung)
)
;
const isAdminOrNhanVien = user?.Vaitro === "Admin" || user?.Vaitro === "NhanVien";
const chuaTiepNhan = yeuCau.filter(item => item.IDNhanVienTiepNhan === (user?.ID_NV || user?.ID_Nguoidung));
const daTiepNhan = yeuCau.filter(item => item.IDNhanVienTiepNhan === (user?.ID_NV || user?.ID_Nguoidung));
    const [showYeuCauTong, setShowYeuCauTong] = useState(false);
const [showYeuCauDaNhan, setShowYeuCauDaNhan] = useState(false);
const [henGoiLaiTimes, setHenGoiLaiTimes] = useState({});


    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser) return;
        setUser(currentUser);

        const fetchYeuCau = () => {
            let url = "";
            if (currentUser.Vaitro === "Admin" || currentUser.Vaitro === "NhanVien") {
                url = "http://localhost:5000/api/yeucau/all";
            } else {
               url = `http://localhost:5000/api/yeucau/taoboi/${currentUser.ID_KH}`;

            }

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setYeuCau(data.data);
                        const notes = {};
                        data.data.forEach(item => {
                            notes[item.IDYeuCau] = item.GhiChu || "";
                        });
                        setGhiChu(notes);
                    }
                })
                .catch(err => console.error("❌ Lỗi khi tải yêu cầu tư vấn:", err));
        };

        fetchYeuCau();
        window.addEventListener("yeucau-updated", fetchYeuCau);
        return () => window.removeEventListener("yeucau-updated", fetchYeuCau);
    }, []);

    const handleUpdateStatus = (idYeuCau, newStatus) => {
    fetch(`http://localhost:5000/api/yeucau/update-status/${idYeuCau}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            TrangThaiYeuCau: newStatus,
            GhiChu: ghiChu[idYeuCau] || "",
            ChinhSuaLanCuoiBoi: user?.Tendangnhap || "unknown"
        }),
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("✅ Đã lưu trạng thái và ghi chú!");
                // 🔁 Gọi lại API để làm mới toàn bộ dữ liệu bao gồm ghi chú
                const encodedEmail = encodeURIComponent(user.Email);
                const url = user.Vaitro === "Admin" || user.Vaitro === "NhanVien"
                    ? "http://localhost:5000/api/yeucau/all"
                    : `http://localhost:5000/api/yeucau/email/${encodedEmail}`;
                
                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            setYeuCau(data.data);
                            const notes = {};
                            data.data.forEach(item => {
                                notes[item.IDYeuCau] = item.GhiChu || "";
                            });
                            setGhiChu(notes);
                        }
                    });
            } else {
                alert("❌ Cập nhật thất bại.");
            }
        })
        .catch(err => console.error("❌ Lỗi khi cập nhật trạng thái:", err));
};

const handleTiepNhan = (idYeuCau) => {
  const IDNhanVien = user?.ID_NV || user?.ID_Nguoidung;

  fetch(`http://localhost:5000/api/yeucau/tiepnhan/${idYeuCau}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      IDNhanVienTiepNhan: IDNhanVien,
      TrangThaiYeuCau: "Đã tiếp nhận", // 👈 Cập nhật luôn trạng thái
      ChinhSuaLanCuoiBoi: user?.Tendangnhap || "unknown"
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Tiếp nhận thành công!");
        // Tải lại toàn bộ yêu cầu tư vấn
        const url = isAdminOrNhanVien
          ? "http://localhost:5000/api/yeucau/all"
          : `http://localhost:5000/api/yeucau/taoboi/${user.ID_KH}`;
        fetch(url)
          .then(res => res.json())
          .then(data => {
            if (data.success) setYeuCau(data.data);
          });
      } else {
        alert("❌ Tiếp nhận thất bại.");
      }
    })
    .catch(err => console.error("Lỗi khi tiếp nhận:", err));
};





    const handleGhiChuChange = (idYeuCau, value) => {
        setGhiChu(prev => ({
            ...prev,
            [idYeuCau]: value
        }));
    };

    return (
  <div className="container" style={{ padding: "20px" }}>
    <h2 style={{ textAlign: "left", marginBottom: "20px" }}>
      Danh sách yêu cầu tư vấn 
    </h2>

    {yeuCau.length === 0 ? (
      <p>Không có yêu cầu tư vấn nào.</p>
    ) : user?.Vaitro === "Admin" || user?.Vaitro === "NhanVien" ? (
      <>



      <h3 
  onClick={() => setShowYeuCauTong(!showYeuCauTong)} 
  style={{ color: "#d9534f", cursor: "pointer", marginBottom: "10px" }}
>
  {user?.Vaitro === "Admin" 
    ? (showYeuCauTong ? "▼ Tổng yêu cầu tư vấn" : "▶ Tổng yêu cầu tư vấn")
    : (showYeuCauTong ? "▼ Yêu cầu chưa tiếp nhận" : "▶ Yêu cầu chưa tiếp nhận")}
</h3>

{showYeuCauTong && (
  <ul style={{ listStyleType: "none", padding: 0 }}>
    {yeuCau.filter(item => {
      if (user?.Vaitro === "Admin") return true;
      return !item.IDNhanVienTiepNhan;
    }).map((item, index) => (
      <li key={item.IDYeuCau} style={{ padding: "15px", borderBottom: "1px solid #ccc" }}>
        <p><strong>#{index + 1}</strong> - {item.Ten} - {item.Email}</p>
        <p><strong>Nội dung:</strong> {item.NoiDungYeuCau}</p>
        {item.IDNhanVienTiepNhan
          ? <p style={{ color: "red", fontWeight: "bold" }}>Đã tiếp nhận</p>
          : (
            <button
              onClick={() => handleTiepNhan(item.IDYeuCau)}
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px"
              }}
            >
              Tiếp nhận
            </button>
          )}
      </li>
    ))}
  </ul>
)}



        

        <h3 
  onClick={() => setShowYeuCauDaNhan(!showYeuCauDaNhan)} 
  style={{ 
    color: "#5cb85c", 
    cursor: "pointer", 
    marginTop: "30px", 
    marginBottom: "10px" 
  }}
>
  {showYeuCauDaNhan ? "▼ Yêu cầu tư vấn đã nhận" : "▶ Yêu cầu tư vấn đã nhận"}
</h3>

{showYeuCauDaNhan && (
  <ul style={{ listStyleType: "none", padding: 0 }}>
    {yeuCau
      .filter(item => item.IDNhanVienTiepNhan === (user?.ID_NV || user?.ID_Nguoidung))
      .map((item, index) => (
        <li
          key={item.IDYeuCau}
          style={{
            marginBottom: "25px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            background: "#f9f9f9"
          }}
        >
          <p><strong>#{index + 1}</strong></p>
          <p><strong>Họ và tên:</strong> <span style={{ fontWeight: "normal" }}>{item.Ten}</span></p>
          <p><strong>Email:</strong> <span style={{ fontWeight: "normal" }}>{item.Email}</span></p>
          <p><strong>Số điện thoại:</strong> <span style={{ fontWeight: "normal" }}>{item.SoDienThoai}</span></p>
          <p><strong>Thời gian gửi:</strong> <span style={{ fontWeight: "normal" }}>
            {new Date(item.NgayGuiYeuCau).toLocaleString("vi-VN", {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </span></p>
          <p><strong>Nội dung yêu cầu:</strong> <span style={{ fontWeight: "normal" }}>{item.NoiDungYeuCau}</span></p>
          <p><strong>Ghi chú:</strong> {item.GhiChu || "Không có ghi chú."}</p>

          <div style={{ marginTop: "10px", width: "100%" }}>
            <label><strong>Trạng thái hiện tại:</strong></label><br />
            <select
              value={item.TrangThaiYeuCau}
              onChange={e => handleUpdateStatus(item.IDYeuCau, e.target.value)}
              style={{ padding: "5px", marginTop: "5px" }}
            >
              <option value="Chưa xử lý">Chưa xử lý</option>
              <option value="Đã tiếp nhận">Đã tiếp nhận</option>
              <option value="Hẹn gọi lại">Hẹn gọi lại</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã xử lý">Đã xử lý</option>
            </select>
            {item.TrangThaiYeuCau === "Hẹn gọi lại" && (
    <div style={{ marginTop: "10px", width: "100%" }}>
      <label><strong>Chọn thời gian gọi lại:</strong></label><br />
      <input
        type="datetime-local"
        value={henGoiLaiTimes[item.IDYeuCau] || ""}
        onChange={e => {
  const value = e.target.value;

  setHenGoiLaiTimes(prev => ({
    ...prev,
    [item.IDYeuCau]: value
  }));

  const formatted = new Date(value).toLocaleString("vi-VN", {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  setGhiChu(prev => ({
    ...prev,
    [item.IDYeuCau]: `Xin hẹn gặp lại quý khách vào lúc ${formatted}`
  }));
}}

        style={{ padding: "5px", marginTop: "5px", width: "100%" }}
        required
      />
    </div>
  )}
          </div>

          <div style={{ marginTop: "10px", width: "100%" }}>
            <label><strong>Thêm ghi chú:</strong></label><br />
            <textarea
              rows="3"
              placeholder="Nhập ghi chú..."
              value={ghiChu[item.IDYeuCau] || ""}
              onChange={e => handleGhiChuChange(item.IDYeuCau, e.target.value)}
              style={{ width: "100%", padding: "20px", marginTop: "5px", resize: "none" }}
            />
            <button
              onClick={() => handleUpdateStatus(item.IDYeuCau, item.TrangThaiYeuCau)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Lưu ghi chú
            </button>
          </div>
        </li>
      ))}
  </ul>
)}


      </>
    ) : (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {yeuCau.map((item, index) => (
          <li
            key={item.IDYeuCau}
            style={{
              marginBottom: "25px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              background: "#f9f9f9"
            }}
          >
            <p><strong>#{index + 1}</strong></p>
            <p><strong>Họ và tên:</strong> <span style={{ fontWeight: "normal" }}>{item.Ten}</span></p>
            <p><strong>Email:</strong> <span style={{ fontWeight: "normal" }}>{item.Email}</span></p>
            <p><strong>Số điện thoại:</strong> <span style={{ fontWeight: "normal" }}>{item.SoDienThoai}</span></p>
            <p><strong>Thời gian gửi:</strong> <span style={{ fontWeight: "normal" }}>
              {new Date(item.NgayGuiYeuCau).toLocaleString("vi-VN", {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span></p>
            <p><strong>Nội dung yêu cầu:</strong> <span style={{ fontWeight: "normal" }}>{item.NoiDungYeuCau}</span></p>
            <p>
              <strong>Trạng thái yêu cầu:</strong>{" "}
              <span style={{
                fontWeight: "bold",
                color:
                  item.TrangThaiYeuCau === "Chưa xử lý" ? "red" :
                  item.TrangThaiYeuCau === "Đang xử lý" ? "orange" :
                  item.TrangThaiYeuCau === "Đã xử lý" ? "green" : "#333"
              }}>
                {item.TrangThaiYeuCau}
              </span>
            </p>
            <p><strong>Phản hồi:</strong> {item.GhiChu || "Không có phản hồi."}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

};

export default YeuCauTuVan;
