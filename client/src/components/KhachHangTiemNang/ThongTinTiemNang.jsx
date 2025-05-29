import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../utils/context";
import "./ThongTinTiemNang.scss";

const ThongTinTiemNang = () => {
    const { user } = useContext(Context);
    const [khachHangs, setKhachHangs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingID, setEditingID] = useState(null);

    const [form, setForm] = useState({
        HoKHTN: "",
        TenLotKHTN: "",
        TenKHTN: "",
        ChucVu: "",
        TenDonVi: "",
        DiaChi: "",
        Email: "",
        SoDienThoai: "",
        GhiChu: ""
    });

    const fetchData = () => {
        axios.get("http://localhost:5000/api/khachhangtiemnang")
            .then((res) => {
                if (res.data.success) {
                    setKhachHangs(res.data.data);
                }
            })
            .catch((err) => {
                console.error("❌ Lỗi khi lấy danh sách khách hàng:", err);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá khách hàng này?")) return;

    try {
        const res = await axios.delete(`http://localhost:5000/api/khachhangtiemnang/${id}`);
        if (res.data.success) {
            alert("✅ Đã xoá khách hàng!");
            fetchData();
        } else {
            alert("❌ Xoá thất bại: " + res.data.message);
        }
    } catch (err) {
        console.error("❌ Lỗi khi xoá khách hàng:", err);
        alert("❌ Đã xảy ra lỗi khi xoá. Kiểm tra console.");
    }
};


    const handleEdit = (kh) => {
        setForm({
            HoKHTN: kh.HoKHTN,
            TenLotKHTN: kh.TenLotKHTN,
            TenKHTN: kh.TenKHTN,
            ChucVu: kh.ChucVu,
            TenDonVi: kh.TenDonVi,
            DiaChi: kh.DiaChi,
            Email: kh.Email,
            SoDienThoai: kh.SoDienThoai,
            GhiChu: kh.GhiChu
        });
        setIsEditing(true);
        setEditingID(kh.IDKHTN);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            IDNhanVien: user?.ID_Nguoidung || "Unknown",
            ...(isEditing
                ? { ChinhSuaLanCuoiBoi: `${user?.Vaitro} - ${user?.Tendangnhap}`, IDKHTN: editingID }
                : { TaoBoi: `${user?.Vaitro} - ${user?.Tendangnhap}` })
        };

        try {
            const url = isEditing
                ? "http://localhost:5000/api/khachhangtiemnang/update"
                : "http://localhost:5000/api/khachhangtiemnang";

            const res = await axios[isEditing ? "put" : "post"](url, payload);

            if (res.data.success) {
                alert(isEditing ? "✅ Đã cập nhật!" : "✅ Đã thêm khách hàng!");
                setForm({
                    HoKHTN: "",
                    TenLotKHTN: "",
                    TenKHTN: "",
                    ChucVu: "",
                    TenDonVi: "",
                    DiaChi: "",
                    Email: "",
                    SoDienThoai: "",
                    GhiChu: ""
                });
                setIsEditing(false);
                setEditingID(null);
                fetchData();
            } else {
                alert("❌ Thao tác thất bại: " + res.data.message);
            }
        } catch (err) {
            console.error("❌ Lỗi khi gửi dữ liệu:", err);
            alert("❌ Có lỗi xảy ra. Kiểm tra console.");
        }
    };

    return (
        <div className="khachhang-table-page">
            <h2 style={{ marginBottom: "1rem" }}>
                {isEditing ? "Chỉnh sửa khách hàng tiềm năng" : "Thêm khách hàng tiềm năng"}
            </h2>

            <form className="form-add-user" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <input name="HoKHTN" placeholder="Họ" value={form.HoKHTN} onChange={handleChange} required />
                    <input name="TenLotKHTN" placeholder="Tên lót" value={form.TenLotKHTN} onChange={handleChange} required />
                    <input name="TenKHTN" placeholder="Tên" value={form.TenKHTN} onChange={handleChange} required />
                    <input name="ChucVu" placeholder="Chức vụ" value={form.ChucVu} onChange={handleChange} />
                    <input name="TenDonVi" placeholder="Đơn vị" value={form.TenDonVi} onChange={handleChange} />
                    <input name="DiaChi" placeholder="Địa chỉ" value={form.DiaChi} onChange={handleChange} />
                    <input name="Email" placeholder="Email" value={form.Email} onChange={handleChange} />
                    <input name="SoDienThoai" placeholder="Số điện thoại" value={form.SoDienThoai} onChange={handleChange} />
                    <input name="GhiChu" placeholder="Ghi chú" value={form.GhiChu} onChange={handleChange} />
                </div>
                <div className="form-actions">
                    <button type="submit">{isEditing ? "Lưu chỉnh sửa" : "Thêm khách hàng"}</button>
                    {isEditing && (
                        <button type="button" onClick={() => {
                            setForm({
                                HoKHTN: "",
                                TenLotKHTN: "",
                                TenKHTN: "",
                                ChucVu: "",
                                TenDonVi: "",
                                DiaChi: "",
                                Email: "",
                                SoDienThoai: "",
                                GhiChu: ""
                            });
                            setIsEditing(false);
                            setEditingID(null);
                        }}>Hủy</button>
                    )}
                </div>
            </form>

            <h3 style={{ margin: "2rem 0 1rem", fontSize: "24px", fontWeight: "600", textAlign: "center" }}>
                Danh sách khách hàng tiềm năng
            </h3>

            <table className="khachhang-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Chức vụ</th>
                        <th>Đơn vị</th>
                        <th>Địa chỉ</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>ID Nhân viên</th>
                        <th>Ghi chú</th>
                        <th>Ngày tạo</th>
                        <th>Tạo bởi</th>
                        <th>Chỉnh sửa lúc</th>
                        <th>Chỉnh sửa bởi</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {khachHangs.map((kh, index) => (
                        <tr key={index}>
                            <td>{kh.IDKHTN}</td>
                            <td>{`${kh.HoKHTN} ${kh.TenLotKHTN} ${kh.TenKHTN}`}</td>
                            <td>{kh.ChucVu}</td>
                            <td>{kh.TenDonVi}</td>
                            <td>{kh.DiaChi}</td>
                            <td>{kh.Email}</td>
                            <td>{kh.SoDienThoai}</td>
                            <td>{kh.IDNhanVien}</td>
                            <td>{kh.GhiChu}</td>
                            <td>{kh.NgayTaoKHTN ? new Date(kh.NgayTaoKHTN).toLocaleDateString("vi-VN") : ""}</td>
                            <td>{kh.TaoBoi}</td>
                            <td>{kh.ChinhSuaLanCuoiVaoLuc ? new Date(kh.ChinhSuaLanCuoiVaoLuc).toLocaleString("vi-VN") : "–"}</td>
                            <td>{kh.ChinhSuaLanCuoiBoi || "–"}</td>
                            <td>
    <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={() => handleEdit(kh)}>Sửa</button>
        <button
            onClick={() => handleDelete(kh.IDKHTN)}
            style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer"
            }}
        >
            Xoá
        </button>
    </div>
</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ThongTinTiemNang;
