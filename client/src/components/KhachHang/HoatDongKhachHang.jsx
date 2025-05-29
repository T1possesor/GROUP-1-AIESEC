import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HoatDongKhachHang.scss";

const HoatDongKhachHang = () => {
    const [hoatDongs, setHoatDongs] = useState([]);
    const [form, setForm] = useState({
        IDKhachHang: "",
        NoiDungHoatDong: ""
    });

    const [search, setSearch] = useState({
        IDKhachHang: "",
        NoiDungHoatDong: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get("http://localhost:5000/api/hoatdongkh")
            .then((res) => {
                if (res.data.success) {
                    setHoatDongs(res.data.data);
                }
            })
            .catch((err) => {
                console.error("❌ Lỗi khi lấy danh sách hoạt động:", err);
            });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.IDKhachHang || !form.NoiDungHoatDong) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/hoatdongkh", form);
            if (res.data.success) {
                alert("✅ Đã thêm hoạt động!");
                setForm({ IDKhachHang: "", NoiDungHoatDong: "" });
                fetchData();
            } else {
                alert("❌ Thêm thất bại.");
            }
        } catch (err) {
            console.error("❌ Lỗi khi thêm hoạt động:", err);
            alert("Có lỗi xảy ra.");
        }
    };

    const filteredData = hoatDongs.filter(hd =>
        hd.IDKhachHang.toLowerCase().includes(search.IDKhachHang.toLowerCase()) &&
        hd.NoiDungHoatDong.toLowerCase().includes(search.NoiDungHoatDong.toLowerCase())
    );

    return (
        <div className="hoatdongkh-page">
            {/* ✅ FORM THÊM */}
            <form className="add-activity-form" onSubmit={handleSubmit}>
                <h4>Thêm hoạt động khách hàng</h4>
                <input
                    type="text"
                    name="IDKhachHang"
                    placeholder="ID Khách Hàng"
                    value={form.IDKhachHang}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="NoiDungHoatDong"
                    placeholder="Nội dung hoạt động"
                    value={form.NoiDungHoatDong}
                    onChange={handleChange}
                    rows={3}
                    required
                />
                <button type="submit">Thêm hoạt động</button>
            </form>

            {/* ✅ TIÊU ĐỀ */}
            <h2>Danh sách hoạt động khách hàng</h2>

            {/* ✅ TRA CỨU GỘP */}
            <div className="search-group-box">
          
                <div className="search-row">
                    <input
                        type="text"
                        placeholder="Nhập nội dung hoạt động"
                        value={search.NoiDungHoatDong}
                        onChange={(e) => setSearch({ ...search, NoiDungHoatDong: e.target.value })}
                    />
                </div>
            </div>

            {/* ✅ DANH SÁCH */}
            <table className="hoatdongkh-table">
                <thead>
                    <tr>
                        <th>ID Hoạt Động</th>
                        <th>ID Khách Hàng</th>
                        <th>Nội dung hoạt động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((hd, index) => (
                        <tr key={index}>
                            <td>{hd.IDHoatDongKH}</td>
                            <td>{hd.IDKhachHang}</td>
                            <td>{hd.NoiDungHoatDong}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HoatDongKhachHang;
