import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../utils/context";
import "./BaoGia.scss";



const BaoGia = () => {
    const { user } = useContext(Context);
    const [baoGias, setBaoGias] = useState([]);
    const [isAddMode, setIsAddMode] = useState(false);
    const [emailModal, setEmailModal] = useState({ show: false, inputEmail: "", id: "" });
    const [filterDegree, setFilterDegree] = useState("");


const handleSendEmail = () => {
    if (!emailModal.inputEmail.trim()) {
        alert("❌ Vui lòng nhập email trước khi gửi.");
        return;
    }
    alert(`✅ Đã gửi báo giá đến ${emailModal.inputEmail}`);
    setEmailModal({ show: false, inputEmail: "", id: "" });
};


    const [form, setForm] = useState({
        Ngaytao: "",
        ChitietDV: "",
        Tongchiphi: "",
        Trangthai: "",
        ID_GV: ""
    });
const [isEditing, setIsEditing] = useState(false);
    const [editingID, setEditingID] = useState(null);
    
    const fetchData = () => {
    axios.get("http://localhost:5000/api/baogia/giaovien") // gọi API JOIN
        .then((res) => {
            if (res.data.success) {
                setBaoGias(res.data.data);
            }
        })
        .catch((err) => {
            console.error("❌ Lỗi khi lấy dữ liệu báo giá + giáo viên:", err);
        });
};


    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = (bg) => {
        setForm({
            Tongchiphi: bg.Tongchiphi
        });
        setIsEditing(true);
        setIsAddMode(false);
        setEditingID(bg.ID_BG);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        ID_BG: editingID,
        Tongchiphi: form.Tongchiphi,
        ChinhSuaLanCuoiBoi: `${user?.Vaitro} - ${user?.Tendangnhap}`
    };

    try {
        const url = isEditing
            ? "http://localhost:5000/api/baogia/update-cost" // 👈 chỉ update chi phí
            : "http://localhost:5000/api/baogia";

        const res = await axios[isEditing ? "put" : "post"](url, payload);

        if (res.data.success) {
            alert(isEditing ? "✅ Đã cập nhật chi phí!" : "✅ Đã thêm báo giá!");
            setForm({ Ngaytao: "", ChitietDV: "", Tongchiphi: "", Trangthai: "", ID_GV: "" });
            setIsEditing(false);
            setEditingID(null);
            fetchData();
        } else {
            alert("❌ Thao tác thất bại: " + res.data.message);
        }
    } catch (err) {
        console.error("❌ Lỗi khi gửi:", err);
        alert("❌ Có lỗi xảy ra. Kiểm tra console.");
    }
};

const filteredBaoGias = baoGias.filter((bg) =>
  bg.BangCap?.toLowerCase().includes(filterDegree.toLowerCase())
);

    return (
        <div className="baogia-page">
            {isEditing && (
  <h2 style={{ marginBottom: "1rem" }}>
    {isAddMode ? "Thêm báo giá" : "Chỉnh sửa báo giá"}
  </h2>
)}


            {isEditing && (
    <form className="form-add-user" onSubmit={handleSubmit}>
        <div className="form-grid">
            <input
                name="Tongchiphi"
                type="number"
                placeholder="Tổng chi phí"
                value={form.Tongchiphi}
                onChange={handleChange}
                required
            />
        </div>
        <div className="form-actions">
            <button type="submit">{isAddMode ? "Lưu thêm báo giá" : "Lưu chỉnh sửa"}</button>

            <button
                type="button"
                onClick={() => {
                    setForm({ Tongchiphi: "" });
                    setIsEditing(false);
                    setEditingID(null);
                }}
            >
                Hủy
            </button>
        </div>
    </form>
)}


            <h3 style={{ margin: "2rem 0 1rem", fontSize: "30px", fontWeight: "600", textAlign: "center" }}>
    Danh sách báo giá 
</h3>
<div style={{ textAlign: "center", marginBottom: "1rem" }}>
  <input
    type="text"
    placeholder="Tìm kiếm theo bằng cấp..."
    value={filterDegree}
    onChange={(e) => setFilterDegree(e.target.value)}
    style={{
      padding: "10px",
      width: "600px",
      maxWidth: "90%",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "18px"
    }}
  />
</div>

<table className="khachhang-table">
    <thead>
        <tr>
            <th>ID báo giá</th>
            <th>ID Giáo viên</th>
            <th>Họ tên</th>
            <th>Bằng cấp</th>
            <th>Quốc tịch</th>
            <th>Email</th>
            <th>Trạng thái GV</th>
            <th>Ngày tạo</th>
            <th>Tổng chi phí</th>
            <th>Tạo bởi</th>
            <th>Chỉnh sửa lần cuối</th>
            <th>Chỉnh sửa bởi</th>
            <th>Hành động</th>
        </tr>
    </thead>
    <tbody>
        {filteredBaoGias.map((bg, index) => (
            <tr key={index}>
                <td>{bg.ID_BG}</td>
                <td>{bg.ID_GV || "–"}</td>
                <td>{bg.HoTen || "–"}</td>
                <td>{bg.BangCap || "–"}</td>
                <td>{bg.QuocTich || "–"}</td>
                <td>{bg.Email || "–"}</td>
                <td>{bg.TrangThaiHSGV || "–"}</td>
                <td>{bg.Ngaytao ? new Date(bg.Ngaytao).toLocaleDateString("vi-VN") : "–"}</td>
                <td>{bg.Tongchiphi ? `${bg.Tongchiphi} $/giờ` : "–"}</td>

                <td>{bg.TaoBoi}</td>
                <td>{bg.ChinhSuaLanCuoiVaoLuc ? new Date(bg.ChinhSuaLanCuoiVaoLuc).toLocaleString("vi-VN") : "–"}</td>
                <td>{bg.ChinhSuaLanCuoiBoi || "–"}</td>
                <td>
  {bg.Tongchiphi ? (
    <div className="action-buttons">
      <button onClick={() => handleEdit(bg)}>Sửa</button>
      <button
        className="notify-btn"
        onClick={() =>
          setEmailModal({
            show: true,
            inputEmail: "",
            id: bg.ID_BG
          })
        }
      >
        Thông báo
      </button>
    </div>
  ) : (
    <div className="action-buttons">
      <button
        className="add-btn"
        onClick={() => {
          setForm({ Tongchiphi: "" });
          setIsEditing(true);
          setIsAddMode(true);
          setEditingID(bg.ID_BG);
        }}
      >
        Thêm
      </button>
    </div>
  )}
</td>



            </tr>
        ))}
    </tbody>
</table>
{emailModal.show && (
  <div className="email-modal-wrapper">
    <div className="email-modal">
      <h4>Gửi báo giá</h4>
      <p>Nhập email để gửi báo giá:</p>
      <input
        type="email"
        placeholder="Nhập email người nhận"
        value={emailModal.inputEmail}
        onChange={(e) =>
          setEmailModal({ ...emailModal, inputEmail: e.target.value })
        }
      />
      <div className="email-actions">
        <button onClick={handleSendEmail}>Gửi</button>
        <button
          onClick={() =>
            setEmailModal({ show: false, inputEmail: "", id: "" })
          }
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
)}



        </div>
    );
};

export default BaoGia;
