import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../utils/context";
import "./ThongTinKhachHang.scss";

const ThongTinKhachHang = () => {
    const { user } = useContext(Context);
    const [khachHangs, setKhachHangs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        HoKH: "",
        TenlotKH: "",
        TenKH: "",
        Chucvu: "",
        Tendonvi: "",
        Diachi: "",
        Email: "",
        SDT: "",
        TrangthaiKH: "",
        Ghichu: "",
        TaoBoi: user ? `${user.Vaitro} - ${user.Tendangnhap}` : "Admin"
    });

    const fetchData = () => {
        axios.get("http://localhost:5000/api/khachhang/all")
            .then(res => {
                if (res.data.success) setKhachHangs(res.data.data);
            })
            .catch(err => console.error("❌ Lỗi khi lấy danh sách khách hàng:", err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = (kh) => {
        setForm({
            HoKH: kh.HoKH,
            TenlotKH: kh.TenlotKH,
            TenKH: kh.TenKH,
            Chucvu: kh.Chucvu,
            Tendonvi: kh.Tendonvi,
            Diachi: kh.Diachi,
            Email: kh.Email,
            SDT: kh.SDT,
            TrangthaiKH: kh.TrangthaiKH,
            Ghichu: kh.Ghichu,
            TaoBoi: kh.TaoBoi
        });
        setIsEditing(true);
        setEditingId(kh.ID_KH);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;

        try {
            const res = await axios.delete(`http://localhost:5000/api/khachhang/${id}`);
            if (res.data.success) {
                alert("✅ Đã xóa khách hàng!");
                fetchData();
            } else alert("❌ Xóa thất bại.");
        } catch (err) {
            console.error("❌ Lỗi khi xóa:", err);
            alert("❌ Có lỗi xảy ra khi xóa.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(form.SDT)) {
            alert("❌ Số điện thoại phải gồm đúng 10 chữ số.");
            return;
        }

        try {
            if (isEditing) {
                const payload = {
                    ...form,
                    ID_KH: editingId,
                    ChinhSuaLanCuoiBoi: user ? `${user.Vaitro} - ${user.Tendangnhap}` : "Admin"
                };
                const res = await axios.put("http://localhost:5000/api/khachhang/update", payload);
                if (res.data.success) {
                    alert("✅ Đã cập nhật khách hàng!");
                    fetchData();
                    resetForm();
                } else alert("❌ Cập nhật thất bại.");
            } else {
                const res = await axios.post("http://localhost:5000/api/khachhang", form);
                if (res.data.success) {
                    alert("✅ Đã thêm khách hàng mới!");
                    fetchData();
                    resetForm();
                } else alert("❌ Thêm thất bại.");
            }
        } catch (err) {
            console.error("❌ Lỗi khi gửi:", err);
            alert("❌ Có lỗi xảy ra.");
        }
    };

    const resetForm = () => {
        setForm({
            HoKH: "",
            TenlotKH: "",
            TenKH: "",
            Chucvu: "",
            Tendonvi: "",
            Diachi: "",
            Email: "",
            SDT: "",
            TrangthaiKH: "",
            Ghichu: "",
            TaoBoi: user ? `${user.Vaitro} - ${user.Tendangnhap}` : "Admin"
        });
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <div className="khachhang-table-page">
            <h2>{isEditing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}</h2>
            <form onSubmit={handleSubmit} className="form-add-user">
                <div className="form-grid">
                    <input type="text" name="HoKH" placeholder="Họ" value={form.HoKH} onChange={handleChange} required />
                    <input type="text" name="TenlotKH" placeholder="Tên lót" value={form.TenlotKH} onChange={handleChange} />
                    <input type="text" name="TenKH" placeholder="Tên" value={form.TenKH} onChange={handleChange} required />
                    <input type="text" name="Chucvu" placeholder="Chức vụ" value={form.Chucvu} onChange={handleChange} />
                    <input type="text" name="Tendonvi" placeholder="Tên đơn vị" value={form.Tendonvi} onChange={handleChange} />
                    <input type="text" name="Diachi" placeholder="Địa chỉ" value={form.Diachi} onChange={handleChange} />
                    <input type="email" name="Email" placeholder="Email" value={form.Email} onChange={handleChange} />
                    <input type="text" name="SDT" placeholder="Số điện thoại" value={form.SDT} onChange={handleChange} />
                    <input type="text" name="TrangthaiKH" placeholder="Trạng thái" value={form.TrangthaiKH} onChange={handleChange} />
                    <input type="text" name="Ghichu" placeholder="Ghi chú" value={form.Ghichu} onChange={handleChange} />
                </div>
                <div className="form-actions">
                    <button type="submit">{isEditing ? "Lưu chỉnh sửa" : "Thêm khách hàng"}</button>
                    {isEditing && <button type="button" onClick={resetForm}>Hủy</button>}
                </div>
            </form>

            <h3 className="table-title">Danh sách khách hàng</h3>
            <table className="khachhang-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ</th>
                        <th>Tên lót</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>SDT</th>
                        <th>Địa chỉ</th>
                        <th>Đơn vị</th>
                        <th>Chức vụ</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Tạo bởi</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {khachHangs.map((kh, index) => (
                        <tr key={index}>
                            <td>{kh.ID_KH}</td>
                            <td>{kh.HoKH}</td>
                            <td>{kh.TenlotKH}</td>
                            <td>{kh.TenKH}</td>
                            <td>{kh.Email}</td>
                            <td>{kh.SDT}</td>
                            <td>{kh.Diachi}</td>
                            <td>{kh.Tendonvi}</td>
                            <td>{kh.Chucvu}</td>
                            <td>{kh.TrangthaiKH}</td>
                            <td>{new Date(kh.TaoVaoLuc).toLocaleDateString("vi-VN")}</td>
                            <td>{kh.TaoBoi}</td>
                            <td>
                                <button onClick={() => handleEdit(kh)}>Sửa</button>
                                <button onClick={() => handleDelete(kh.ID_KH)} style={{ marginLeft: "8px", backgroundColor: "red", color: "white" }}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ThongTinKhachHang;
