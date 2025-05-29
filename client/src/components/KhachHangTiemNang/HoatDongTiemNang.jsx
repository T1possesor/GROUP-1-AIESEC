import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../utils/context";
import "./HoatDongTiemNang.scss";

const HoatDongTiemNang = () => {
    const { user } = useContext(Context);
    const [hoatDongs, setHoatDongs] = useState([]);
    const [form, setForm] = useState({
        ID_KH: "",
        ID_NV: "",
        Ngaythuchien: "",
        NoidungHD: "",
        Ghichu: "",
        Trangthai: ""
    });

    useEffect(() => {
        if (user?.ID_NV || user?.ID_Nguoidung) {
            setForm(prev => ({ ...prev, ID_NV: user.ID_NV || user.ID_Nguoidung }));
        }
        fetchData();
    }, [user]);

    const fetchData = () => {
        axios.get("http://localhost:5000/api/hoatdongtiemnang")
            .then((res) => {
                if (res.data.success) {
                    setHoatDongs(res.data.data);
                }
            })
            .catch((err) => {
                console.error("❌ Lỗi khi lấy dữ liệu hoạt động:", err);
            });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/hoatdongtiemnang", form);
            if (res.data.success) {
                alert("✅ Đã thêm hoạt động!");
                setForm({
                    ID_KH: "",
                    ID_NV: user?.ID_NV || user?.ID_Nguoidung || "Unknown",
                    Ngaythuchien: "",
                    NoidungHD: "",
                    Ghichu: "",
                    Trangthai: ""
                });
                fetchData();
            } else {
                alert("❌ Thêm thất bại: " + res.data.message);
            }
        } catch (err) {
            console.error("❌ Lỗi khi thêm hoạt động:", err);
            alert("❌ Có lỗi xảy ra. Kiểm tra console.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá hoạt động này?")) return;

        try {
            const res = await axios.delete(`http://localhost:5000/api/hoatdongtiemnang/${id}`);
            if (res.data.success) {
                alert("✅ Đã xoá hoạt động!");
                fetchData();
            } else {
                alert("❌ Xoá thất bại: " + res.data.message);
            }
        } catch (err) {
            console.error("❌ Lỗi khi xoá hoạt động:", err);
            alert("❌ Có lỗi xảy ra khi xoá. Kiểm tra console.");
        }
    };

    return (
        <div className="khachhang-table-page">
            <h2 style={{ marginBottom: "1rem" }}>Thêm hoạt động khách hàng tiềm năng</h2>

            <form className="form-add-user" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <input name="ID_KH" placeholder="ID Khách hàng" value={form.ID_KH} onChange={handleChange} required />
                    <input name="Ngaythuchien" type="date" value={form.Ngaythuchien} onChange={handleChange} required />
                    <input name="NoidungHD" placeholder="Nội dung hoạt động" value={form.NoidungHD} onChange={handleChange} />
                    <input name="Ghichu" placeholder="Ghi chú" value={form.Ghichu} onChange={handleChange} />
                    <input name="Trangthai" placeholder="Trạng thái" value={form.Trangthai} onChange={handleChange} />
                </div>
                <div className="form-actions">
                    <button type="submit">Thêm hoạt động</button>
                </div>
            </form>

            <h3 style={{ margin: "2rem 0 1rem", fontSize: "24px", fontWeight: "600", textAlign: "center" }}>
                Danh sách hoạt động khách hàng tiềm năng
            </h3>

            <table className="khachhang-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID Khách hàng</th>
                        <th>ID Nhân viên</th>
                        <th>Ngày thực hiện</th>
                        <th>Nội dung</th>
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {hoatDongs.map((hd, index) => (
                        <tr key={index}>
                            <td>{hd.ID_HDKHTN}</td>
                            <td>{hd.ID_KH}</td>
                            <td>{hd.ID_NV}</td>
                            <td>{hd.Ngaythuchien ? new Date(hd.Ngaythuchien).toLocaleDateString("vi-VN") : ""}</td>
                            <td>{hd.NoidungHD}</td>
                            <td>{hd.Ghichu}</td>
                            <td>{hd.Trangthai}</td>
                            <td>
                                <button onClick={() => handleDelete(hd.ID_HDKHTN)} style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>
                                    Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HoatDongTiemNang;
