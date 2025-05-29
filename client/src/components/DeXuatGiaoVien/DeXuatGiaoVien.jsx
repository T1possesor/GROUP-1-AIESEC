import React, { useState } from "react";
import axios from "axios";
import "./DeXuatGiaoVien.scss";

const DeXuatGiaoVien = () => {
    const [teachers, setTeachers] = useState([]);
    const [degree, setDegree] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [customerEmail, setCustomerEmail] = useState("");
    const [actionType, setActionType] = useState(""); // "de-xuat" hoặc "sap-xep"
    const [area, setArea] = useState("");
    const [schedule, setSchedule] = useState("");

    const handleSearch = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/hosogv");
            const filtered = res.data.filter((gv) =>
                gv.BangCap.toLowerCase().includes(degree.toLowerCase())
            );
            setTeachers(filtered);
            setHasSearched(true);
        } catch (err) {
            console.error("❌ Lỗi khi tìm giáo viên:", err);
        }
    };

    const handleDeXuat = (teacher) => {
        setSelectedTeacher(teacher);
        setCustomerEmail("");
        setActionType("de-xuat");
        setArea("");
        setSchedule("");
    };

    const handleSapXep = (teacher) => {
        setSelectedTeacher(teacher);
        setCustomerEmail("");
        setActionType("sap-xep");
        setArea("");
        setSchedule("");
    };

    const handleGuiEmail = () => {
        if (!customerEmail) {
            alert("❗ Vui lòng nhập email khách hàng.");
            return;
        }

       if (!customerEmail) {
    alert("❗ Vui lòng nhập email khách hàng hoặc ID hợp đồng.");
    return;
}


        const actionLabel = actionType === "sap-xep" ? "sắp xếp" : "đề xuất";

        alert(`✅ Đã gửi thông báo ${actionLabel} giáo viên "${selectedTeacher.HoTen}" đến ${customerEmail}`);

        // axios.post("http://localhost:5000/api/hubspot/sendmail", {
        //     teacher: selectedTeacher,
        //     email: customerEmail,
        //     area,
        //     schedule,
        //     type: actionType
        // });

        setSelectedTeacher(null);
        setActionType("");
    };

    return (
        <div className="dexuat-giaovien">
            <h1>Đề xuất giáo viên</h1>

            <div className="search-form">
                <label htmlFor="degree">Nhập bằng cấp</label>
                <input
                    type="text"
                    id="degree"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="Ví dụ: CELTA, TESOL..."
                />
                <button onClick={handleSearch}>Tìm</button>
            </div>

            {hasSearched && (
                <>
                    {teachers.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Họ tên</th>
                                    <th>Bằng cấp</th>
                                    <th>Quốc tịch</th>
                                    <th>Email</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((gv) => (
                                    <tr key={gv.ID_GV}>
                                        <td>{gv.HoTen}</td>
                                        <td>{gv.BangCap}</td>
                                        <td>{gv.QuocTich}</td>
                                        <td>{gv.Email}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeXuat(gv)}
                                                style={{
                                                    marginRight: "8px",
                                                    backgroundColor: "#27ae60",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "6px 10px",
                                                    borderRadius: "4px"
                                                }}
                                            >
                                                Đề xuất
                                            </button>
                                            <button
                                                onClick={() => handleSapXep(gv)}
                                                style={{
                                                    backgroundColor: "#3498db",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "6px 10px",
                                                    borderRadius: "4px"
                                                }}
                                            >
                                                Sắp xếp
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Không tìm thấy giáo viên phù hợp.</p>
                    )}

                    {selectedTeacher && (
                        <div className="email-form" style={{ marginTop: "20px" }}>
                            <h3 style={{ marginBottom: "10px" }}>
  {actionType === "sap-xep"
    ? "Nhập thông tin hợp đồng để gửi sắp xếp:"
    : "Nhập thông tin khách hàng để gửi đề xuất:"}
</h3>


                            {actionType === "de-xuat" && (
    <input
        type="email"
        placeholder="Nhập Email khách hàng..."
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
        style={{ padding: "8px", width: "300px", marginBottom: "10px"}}
    />
)}

{actionType === "sap-xep" && (
    <input
        type="text"
        placeholder="Nhập ID hợp đồng..."
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
        style={{ padding: "8px", width: "300px", marginBottom: "0px" }}
    />
)}


                            <br />
                            <button
                                onClick={handleGuiEmail}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#2ecc71",
                                    border: "none",
                                    color: "#fff",
                                    borderRadius: "4px"
                                }}
                            >
                                Gửi
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DeXuatGiaoVien;
