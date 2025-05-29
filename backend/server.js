const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'your_password', // ← thay bằng mật khẩu thật của bạn
  database: 'app2n'
});

db.connect(err => {
  if (err) {
    console.error('❌ Kết nối MySQL thất bại:', err.message);
    return;
  }
  console.log('✅ Đã kết nối tới MySQL Workbench!');
});

// API login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT 
      ID_Nguoidung, 
      Tendangnhap, 
      Vaitro, 
      Email
    FROM TaiKhoanNguoiDung
    WHERE Tendangnhap = ? AND Matkhau = ?
    LIMIT 1
  `;

  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu sai' });
    }

    const user = results[0];

    // 👉 Phân loại ID: Khách hàng hoặc nhân viên
    if (user.Vaitro === "KhachHang") {
      user.ID_KH = user.ID_Nguoidung;
    } else {
      user.ID_NV = user.ID_Nguoidung;
    }

    delete user.ID_Nguoidung; // ẩn ID gốc nếu không cần
    res.json({ success: true, user });
  });
});

// API lấy tất cả phản hồi
app.get('/api/phanhoi/all', (req, res) => {
    const query = `SELECT ID_DG, Noidung, TaoBoi FROM PhanHoi`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi truy vấn phản hồi:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn phản hồi" });
        }

        res.json({ success: true, data: results });
    });
});


// API thêm yêu cầu tư vấn
// API thêm yêu cầu tư vấn
app.post('/api/yeucau', (req, res) => {
    const { name, email, phone, note, nguon = "Website", taoBoi = "Khách" } = req.body;

    const query = `
        INSERT INTO YeuCauTuVan (IDYeuCau, Ten, Email, SoDienThoai, NgayGuiYeuCau, NoiDungYeuCau, TrangThaiYeuCau, Nguon, TaoBoi)
        VALUES (?, ?, ?, ?, NOW(), ?, 'Chưa xử lý', ?, ?)
    `;

    const randomID = 'YC' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    db.query(query, [randomID, name, email, phone, note, nguon, taoBoi], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi thêm yêu cầu:", err);
            return res.status(500).json({ success: false, message: "Lỗi khi thêm yêu cầu" });
        }
        res.json({ success: true, message: "Đã lưu yêu cầu tư vấn" });
    });
});


// PUT cập nhật chỉ Tổng chi phí
app.put("/api/baogia/update-cost", (req, res) => {
    const { ID_BG, Tongchiphi, ChinhSuaLanCuoiBoi } = req.body;

    if (!ID_BG || !Tongchiphi) {
        return res.status(400).json({ success: false, message: "Thiếu ID_BG hoặc Tổng chi phí" });
    }

    const ChinhSuaLanCuoiVaoLuc = new Date();

    const query = `
        UPDATE BaoGia
        SET Tongchiphi = ?,
            ChinhSuaLanCuoiVaoLuc = ?,
            ChinhSuaLanCuoiBoi = ?
        WHERE ID_BG = ?
    `;

    db.query(query, [Tongchiphi, ChinhSuaLanCuoiVaoLuc, ChinhSuaLanCuoiBoi, ID_BG], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi cập nhật chi phí:", err.sqlMessage);
            return res.status(500).json({ success: false, message: "Lỗi cập nhật", error: err.sqlMessage });
        }

        res.json({ success: true, message: "✅ Đã cập nhật tổng chi phí thành công" });
    });
});



app.get("/api/baogia", (req, res) => {
    const query = "SELECT * FROM BaoGia ORDER BY Ngaytao DESC";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Lỗi truy vấn", error: err.sqlMessage });
        res.json({ success: true, data: results });
    });
});


// Thêm báo giá
app.post("/api/baogia", (req, res) => {
    const { Ngaytao, ChitietDV, Tongchiphi, Trangthai, TaoBoi } = req.body;

    // Tạo ID báo giá theo định dạng BGxx
    const getMaxIdQuery = "SELECT ID_BG FROM BaoGia ORDER BY ID_BG DESC LIMIT 1";

    db.query(getMaxIdQuery, (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi lấy ID_BG lớn nhất:", err.sqlMessage);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy ID", error: err.sqlMessage });
        }

        let newIdNumber = 1;
        if (results.length > 0) {
            const lastId = results[0].ID_BG; // VD: "BG09"
            const lastNumber = parseInt(lastId.replace("BG", ""));
            newIdNumber = lastNumber + 1;
        }

        const ID_BG = `BG${newIdNumber.toString().padStart(2, "0")}`;
        const TaoVaoLuc = new Date();
        const ChinhSuaLanCuoiVaoLuc = null;
        const ChinhSuaLanCuoiBoi = null;

        const insertQuery = `
            INSERT INTO BaoGia (
                ID_BG, Ngaytao, ChitietDV, Tongchiphi, Trangthai,
                TaoVaoLuc, TaoBoi, ChinhSuaLanCuoiVaoLuc, ChinhSuaLanCuoiBoi
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [
            ID_BG, Ngaytao, ChitietDV, Tongchiphi, Trangthai,
            TaoVaoLuc, TaoBoi, ChinhSuaLanCuoiVaoLuc, ChinhSuaLanCuoiBoi
        ], (err, result) => {
            if (err) {
                console.error("❌ Lỗi thêm báo giá:", err.sqlMessage);
                return res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu", error: err.sqlMessage });
            }
            res.json({ success: true, message: "✅ Đã thêm báo giá thành công", ID_BG });
        });
    });
});


// Cập nhật báo giá
app.put("/api/baogia/update", (req, res) => {
    const { ID_BG, Ngaytao, ChitietDV, Tongchiphi, Trangthai, ChinhSuaLanCuoiBoi } = req.body;

    if (!ID_BG) {
        return res.status(400).json({ success: false, message: "Thiếu ID_BG để cập nhật" });
    }

    const ChinhSuaLanCuoiVaoLuc = new Date();

    const query = `
        UPDATE BaoGia
        SET Ngaytao = ?, 
            ChitietDV = ?, 
            Tongchiphi = ?, 
            Trangthai = ?, 
            ChinhSuaLanCuoiVaoLuc = ?, 
            ChinhSuaLanCuoiBoi = ?
        WHERE ID_BG = ?
    `;

    db.query(query, [
        Ngaytao,
        ChitietDV,
        Tongchiphi,
        Trangthai,
        ChinhSuaLanCuoiVaoLuc,
        ChinhSuaLanCuoiBoi,
        ID_BG
    ], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi cập nhật báo giá:", err.sqlMessage);
            return res.status(500).json({ success: false, message: "Lỗi cập nhật dữ liệu", error: err.sqlMessage });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy báo giá với ID đã cho" });
        }

        res.json({ success: true, message: "✅ Đã cập nhật báo giá thành công" });
    });
});

// GET kết hợp BaoGia + HoSoGV
app.get("/api/baogia/giaovien", (req, res) => {
    const query = `
        SELECT 
            bg.ID_BG,
            bg.ID_GV,
            gv.HoTen,
            gv.BangCap,
            gv.QuocTich,
            gv.Email,
            gv.TrangThaiHSGV,
            bg.Ngaytao,
            bg.Tongchiphi,
            bg.TaoBoi,
            bg.ChinhSuaLanCuoiVaoLuc,
            bg.ChinhSuaLanCuoiBoi
        FROM BaoGia bg
        LEFT JOIN HoSoGV gv ON bg.ID_GV = gv.ID_GV
        ORDER BY bg.Ngaytao DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn", error: err.sqlMessage });
        }

        res.json({ success: true, data: results });
    });
});

app.get('/api/email-from-idkh/:idKH', (req, res) => {
    const idKH = req.params.idKH;
    const query = `SELECT Email FROM TaiKhoanNguoiDung WHERE ID_Nguoidung = ?`;

    db.query(query, [idKH], (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn email:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn" });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy email" });
        }

        res.json({ success: true, email: results[0].Email });
    });
});


// API lấy toàn bộ hợp đồng (cho Admin/Nhân viên)
app.get('/api/hopdong/all', (req, res) => {
    const query = `
        SELECT *
        FROM HopDong
        ORDER BY Ngaybatdau DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi truy vấn tất cả hợp đồng:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn hợp đồng" });
        }

        res.json({ success: true, data: results });
    });
});

// API lấy hợp đồng theo ID khách hàng
app.get('/api/hopdong/:idKH', (req, res) => {
    const { idKH } = req.params;

    const query = `
        SELECT ID_HDong, TenHDong, GiatriHDong, Ngaybatdau, Ngayketthuc, Trangthai
        FROM HopDong
        WHERE ID_KH = ?
    `;

    db.query(query, [idKH], (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi truy vấn hợp đồng:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn" });
        }

        res.json({ success: true, data: results });
    });
});




app.get("/api/hosogv", (req, res) => {
    const query = "SELECT * FROM HoSoGV WHERE TrangThaiHSGV = 'Đã duyệt'";
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn" });
        }
        res.json(results);
    });
});





app.post('/api/hopdong', (req, res) => {
    const {
        ID_KH,
        ID_NV, // 👈 vẫn giữ nếu bạn đang truyền từ frontend
        TenHDong,
        GiatriHDong,
        Ngaybatdau,
        Ngayketthuc,
        TaoBoi
    } = req.body;

    // 👉 Tạo ID_HDong ngẫu nhiên dạng HDxxxxxx
    const ID_HDong = 'HD' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    const query = `
        INSERT INTO HopDong (
            ID_HDong,
            ID_KH,
            ID_NV,
            TenHDong,
            GiatriHDong,
            Ngaybatdau,
            Ngayketthuc,
            Trangthai,
            TaoVaoLuc,
            TaoBoi
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Chờ duyệt', NOW(), ?)
    `;

    db.query(query, [
        ID_HDong,
        ID_KH,
        ID_NV,             // 👈 lưu lại đúng người đang tạo
        TenHDong,
        GiatriHDong,
        Ngaybatdau,
        Ngayketthuc,
        TaoBoi
    ], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi thêm hợp đồng:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn" });
        }

        res.json({
            success: true,
            message: "✅ Hợp đồng đã được thêm!",
            ID_HDong // trả lại ID nếu frontend cần
        });
    });
});

// ✅ API cho phép Admin/Nhân viên cập nhật trạng thái hợp đồng
app.put('/api/hopdong/update-status/:id', (req, res) => {
    const { id } = req.params;
    const { Trangthai, ChinhSuaLanCuoiBoi } = req.body;

    const query = `
        UPDATE HopDong
        SET Trangthai = ?, 
            ChinhSuaLanCuoiVaoLuc = NOW(),
            ChinhSuaLanCuoiBoi = ?
        WHERE ID_HDong = ?
    `;

    db.query(query, [Trangthai, ChinhSuaLanCuoiBoi, id], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi cập nhật trạng thái hợp đồng:", err);
            return res.status(500).json({ success: false, message: "Lỗi cập nhật trạng thái" });
        }

        res.json({ success: true, message: "✅ Trạng thái hợp đồng đã được cập nhật!" });
    });
});


// API lấy toàn bộ đánh giá (cho Admin và Nhân viên)
app.get('/api/danhgia/all', (req, res) => {
    const query = `SELECT * FROM DanhGia ORDER BY TaoVaoLuc DESC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi truy vấn đánh giá:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn đánh giá" });
        }

        res.json({ success: true, data: results });
    });
});

app.post("/api/phanhoi", (req, res) => {
    const { ID_DG, ID_NV, Noidung, TaoBoi } = req.body;

    // Ghi log đầu vào
    console.log("📥 Nhận dữ liệu phản hồi:", req.body);

    // Kiểm tra dữ liệu đầy đủ chưa
    if (!ID_DG || !ID_NV || !Noidung || !TaoBoi) {
        return res.status(400).json({
            success: false,
            message: "❌ Thiếu thông tin phản hồi.",
            missing: {
                ID_DG: !!ID_DG,
                ID_NV: !!ID_NV,
                Noidung: !!Noidung,
                TaoBoi: !!TaoBoi,
            },
        });
    }

    const checkQuery = "SELECT * FROM PhanHoi WHERE ID_DG = ?";
    db.query(checkQuery, [ID_DG], (err, results) => {
        if (err) {
            console.error("❌ Lỗi kiểm tra phản hồi:", err);
            return res.status(500).json({ success: false, message: "Lỗi kiểm tra phản hồi", error: err.message });
        }

        if (results.length > 0) {
            // Cập nhật nếu đã có phản hồi
            const updateQuery = `
                UPDATE PhanHoi
                SET Noidung = ?, ChinhSuaLanCuoiVaoLuc = NOW(), ChinhSuaLanCuoiBoi = ?
                WHERE ID_DG = ?
            `;
            db.query(updateQuery, [Noidung, TaoBoi, ID_DG], (err2) => {
                if (err2) {
                    console.error("❌ Lỗi cập nhật phản hồi:", err2);
                    return res.status(500).json({ success: false, message: "Lỗi cập nhật phản hồi", error: err2.message });
                }
                return res.json({ success: true, message: "✅ Phản hồi đã được cập nhật!" });
            });
        } else {
            // Tạo ID phản hồi mới
            const ID_PH = "PH" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
            console.log("🆔 Tạo ID_PH mới:", ID_PH);

            const insertQuery = `
                INSERT INTO PhanHoi
                (ID_PH, ID_DG, ID_NV, Noidung, TaoVaoLuc, TaoBoi, ChinhSuaLanCuoiVaoLuc, ChinhSuaLanCuoiBoi)
                VALUES (?, ?, ?, ?, NOW(), ?, NOW(), ?)
            `;

            db.query(insertQuery, [ID_PH, ID_DG, ID_NV, Noidung, TaoBoi, TaoBoi], (err3) => {
                if (err3) {
                    console.error("❌ Lỗi thêm phản hồi:", err3);
                    return res.status(500).json({ success: false, message: "Lỗi thêm phản hồi", error: err3.message });
                }

                return res.json({ success: true, message: "✅ Phản hồi đã được lưu!" });
            });
        }
    });
});


app.get('/api/khachhang/all', (req, res) => {
    const query = `
        SELECT * FROM KhachHang
        ORDER BY TaoVaoLuc DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn khách hàng:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn khách hàng" });
        }

        res.json({ success: true, data: results });
    });
});


app.post('/api/khachhang', (req, res) => {
    const {
        HoKH, TenlotKH, TenKH, Chucvu, Tendonvi, Diachi, Email,
        SDT, TrangthaiKH, Ghichu, TaoBoi
    } = req.body;

    const getLatestIdQuery = `
        SELECT ID_KH FROM KhachHang
        WHERE ID_KH LIKE 'KH%'
        ORDER BY ID_KH DESC
        LIMIT 1
    `;

    db.query(getLatestIdQuery, (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi lấy ID cuối:", err);
            return res.status(500).json({ success: false, message: "Lỗi tạo mã ID." });
        }

        let newId = "KH001";
        if (results.length > 0) {
            const lastId = results[0].ID_KH;
            const nextNum = parseInt(lastId.replace("KH", "")) + 1;
            newId = "KH" + nextNum.toString().padStart(3, "0");
        }

        const insertQuery = `
            INSERT INTO KhachHang (
                ID_KH, HoKH, TenlotKH, TenKH, Chucvu, Tendonvi, Diachi, Email,
                SDT, NgaytaoKH, TrangthaiKH, Ghichu, TaoVaoLuc, TaoBoi
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, NOW(), ?)
        `;

        db.query(insertQuery, [
            newId, HoKH, TenlotKH, TenKH, Chucvu, Tendonvi, Diachi,
            Email, SDT, TrangthaiKH, Ghichu, TaoBoi
        ], (err, result) => {
            if (err) {
                console.error("❌ Lỗi khi thêm khách hàng:", err);
                return res.status(500).json({ success: false, message: "Lỗi thêm khách hàng" });
            }

            res.json({ success: true, message: "✅ Tạo khách hàng thành công", ID_KH: newId });
        });
    });
});




app.put('/api/khachhang/update', (req, res) => {
    const {
        ID_KH, HoKH, TenlotKH, TenKH, Chucvu, Tendonvi, Diachi, Email,
        SDT, TrangthaiKH, Ghichu, ChinhSuaLanCuoiBoi
    } = req.body;

    const updateQuery = `
        UPDATE KhachHang
        SET HoKH = ?, TenlotKH = ?, TenKH = ?, Chucvu = ?, Tendonvi = ?, Diachi = ?,
            Email = ?, SDT = ?, TrangthaiKH = ?, Ghichu = ?, 
            ChinhSuaLanCuoiVaoLuc = NOW(), ChinhSuaLanCuoiBoi = ?
        WHERE ID_KH = ?
    `;

    db.query(updateQuery, [
        HoKH, TenlotKH, TenKH, Chucvu, Tendonvi, Diachi,
        Email, SDT, TrangthaiKH, Ghichu, ChinhSuaLanCuoiBoi, ID_KH
    ], (err, result) => {
        if (err) {
            console.error("❌ Lỗi cập nhật khách hàng:", err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});




app.post('/api/danhgia', (req, res) => {
    const { ID_KH, ID_HDong, Noidung, Sosao, TaoBoi } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!ID_KH || !ID_HDong || !Noidung || !Sosao || !TaoBoi) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin đánh giá. Vui lòng điền đầy đủ."
        });
    }

    // Sinh mã ID_DG duy nhất
    const ID_DG = 'DG' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    const query = `
        INSERT INTO DanhGia 
        (ID_DG, ID_KH, ID_HDong, Noidung, Sosao, TaoVaoLuc, TaoBoi, ChinhSuaLanCuoiVaoLuc, ChinhSuaLanCuoiBoi)
        VALUES (?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)
    `;

    const values = [ID_DG, ID_KH, ID_HDong, Noidung, Sosao, TaoBoi, TaoBoi];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi lưu đánh giá:", err);
            return res.status(500).json({
                success: false,
                message: "Lỗi khi lưu đánh giá vào cơ sở dữ liệu."
            });
        }

        res.json({
            success: true,
            message: "✅ Đánh giá đã được lưu thành công!"
        });
    });
});



app.get('/api/danhgia/:idKH', (req, res) => {
    const { idKH } = req.params;
    const query = `SELECT * FROM DanhGia WHERE ID_KH = ?`;
    db.query(query, [idKH], (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, data: results });
    });
});

app.post('/api/check-password', (req, res) => {
    const { ID_Nguoidung, Matkhau } = req.body;

    const query = `
        SELECT * FROM TaiKhoanNguoiDung
        WHERE ID_Nguoidung = ? AND Matkhau = ?
    `;

    db.query(query, [ID_Nguoidung, Matkhau], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.json({ success: false });

        return res.json({ success: true });
    });
});

// Đảm bảo bạn đã kết nối MySQL thành công vào biến `db`

app.get("/api/khachhangtiemnang", (req, res) => {
    const query = "SELECT * FROM KhachHangTiemNang ORDER BY TaoVaoLuc DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn khách hàng tiềm năng:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn" });
        }

        res.json({ success: true, data: results });
    });
});

app.post("/api/khachhangtiemnang", (req, res) => {
    const {
        HoKHTN,
        TenLotKHTN,
        TenKHTN,
        ChucVu,
        TenDonVi,
        DiaChi,
        Email,
        SoDienThoai,
        IDNhanVien,
        GhiChu,
        TaoBoi
    } = req.body;

    // 1. Tìm IDKHTN mới
    const getNextID = (callback) => {
        const idQuery = `
            SELECT IDKHTN FROM KhachHangTiemNang
            WHERE IDKHTN LIKE 'KHTN%'
            ORDER BY IDKHTN DESC
            LIMIT 1
        `;
        db.query(idQuery, (err, results) => {
            if (err) {
                return callback(err);
            }

            let nextNumber = 2; // mặc định là 02 nếu chưa có ai
            if (results.length > 0) {
                const lastID = results[0].IDKHTN; // VD: "KHTN09"
                const numericPart = parseInt(lastID.replace("KHTN", ""), 10);
                nextNumber = numericPart + 1;
            }

            const newID = `KHTN${nextNumber.toString().padStart(3, "0")}`; // ví dụ: "KHTN02", "KHTN10"
            callback(null, newID);
        });
    };

    getNextID((err, IDKHTN) => {
        if (err) {
            console.error("❌ Lỗi khi lấy ID:", err);
            return res.status(500).json({ success: false, message: "Lỗi tạo ID khách hàng" });
        }

        const NgayTaoKHTN = new Date();
        const TaoVaoLuc = new Date();

        const query = `
            INSERT INTO KhachHangTiemNang (
                IDKHTN, HoKHTN, TenLotKHTN, TenKHTN,
                ChucVu, TenDonVi, DiaChi, Email, SoDienThoai,
                IDNhanVien, GhiChu, NgayTaoKHTN, TaoVaoLuc, TaoBoi
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            IDKHTN,
            HoKHTN,
            TenLotKHTN,
            TenKHTN,
            ChucVu,
            TenDonVi,
            DiaChi,
            Email,
            SoDienThoai,
            IDNhanVien,
            GhiChu,
            NgayTaoKHTN,
            TaoVaoLuc,
            TaoBoi
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Lỗi khi thêm khách hàng tiềm năng:", err);
                return res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu" });
            }

            res.json({ success: true, message: "Đã thêm khách hàng tiềm năng thành công" });
        });
    });
});



app.put("/api/khachhangtiemnang/update", (req, res) => {
    const {
        IDKHTN,
        HoKHTN,
        TenLotKHTN,
        TenKHTN,
        ChucVu,
        TenDonVi,
        DiaChi,
        Email,
        SoDienThoai,
        IDNhanVien,
        GhiChu,
        ChinhSuaLanCuoiBoi
    } = req.body;

    if (!IDKHTN) {
        return res.status(400).json({ success: false, message: "Thiếu IDKHTN để cập nhật" });
    }

    const ChinhSuaLanCuoiVaoLuc = new Date();

    const query = `
        UPDATE KhachHangTiemNang
        SET
            HoKHTN = ?, TenLotKHTN = ?, TenKHTN = ?,
            ChucVu = ?, TenDonVi = ?, DiaChi = ?, Email = ?,
            SoDienThoai = ?, IDNhanVien = ?, GhiChu = ?,
            ChinhSuaLanCuoiVaoLuc = ?, ChinhSuaLanCuoiBoi = ?
        WHERE IDKHTN = ?
    `;

    const values = [
        HoKHTN,
        TenLotKHTN,
        TenKHTN,
        ChucVu,
        TenDonVi,
        DiaChi,
        Email,
        SoDienThoai,
        IDNhanVien,
        GhiChu,
        ChinhSuaLanCuoiVaoLuc,
        ChinhSuaLanCuoiBoi,
        IDKHTN
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi cập nhật khách hàng tiềm năng:", err);
            return res.status(500).json({ success: false, message: "Lỗi cập nhật dữ liệu" });
        }

        res.json({ success: true, message: "✅ Cập nhật thành công" });
    });
});

app.delete("/api/khachhangtiemnang/:id", (req, res) => {
    const id = req.params.id;

    const query = "DELETE FROM KhachHangTiemNang WHERE IDKHTN = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi xoá khách hàng tiềm năng:", err);
            return res.status(500).json({ success: false, message: "Lỗi xoá dữ liệu" });
        }

        res.json({ success: true, message: "✅ Đã xoá khách hàng thành công" });
    });
});

// Lấy danh sách hoạt động khách hàng tiềm năng
app.get("/api/hoatdongtiemnang", (req, res) => {
    const query = "SELECT * FROM HoatDongKhachHangTiemNang ORDER BY Ngaythuchien DESC";
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn hoạt động:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn" });
        }
        res.json({ success: true, data: results });
    });
});

// Thêm hoạt động khách hàng tiềm năng
app.post("/api/hoatdongtiemnang", (req, res) => {
    const { ID_KH, ID_NV, Ngaythuchien, NoidungHD, Ghichu, Trangthai } = req.body;

    // Truy vấn lấy ID_HDKHTN lớn nhất hiện tại
    const getMaxIdQuery = "SELECT ID_HDKHTN FROM HoatDongKhachHangTiemNang ORDER BY ID_HDKHTN DESC LIMIT 1";

    db.query(getMaxIdQuery, (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi lấy ID lớn nhất:", err.sqlMessage);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy ID", error: err.sqlMessage });
        }

        let newIdNumber = 1; // mặc định nếu chưa có ID nào
        if (results.length > 0) {
            const lastId = results[0].ID_HDKHTN; // VD: "KHTN09"
            const lastNumber = parseInt(lastId.replace("HDKHTN", ""));
            newIdNumber = lastNumber + 1;
        }

        const ID_HDKHTN = `HDKHTN${newIdNumber.toString().padStart(3, "0")}`; // VD: KHTN02, KHTN10

        const insertQuery = `
            INSERT INTO HoatDongKhachHangTiemNang 
            (ID_HDKHTN, ID_KH, ID_NV, Ngaythuchien, NoidungHD, Ghichu, Trangthai)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [ID_HDKHTN, ID_KH, ID_NV, Ngaythuchien, NoidungHD, Ghichu, Trangthai], (err, result) => {
            if (err) {
                console.error("❌ Lỗi thêm hoạt động:", err.sqlMessage);
                return res.status(500).json({ success: false, message: "Lỗi thêm dữ liệu", error: err.sqlMessage });
            }
            res.json({ success: true, message: "Đã thêm hoạt động thành công", ID_HDKHTN });
        });
    });
});


// Xoá hoạt động khách hàng tiềm năng
app.delete("/api/hoatdongtiemnang/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM HoatDongKhachHangTiemNang WHERE ID_HDKHTN = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ Lỗi xoá hoạt động:", err.sqlMessage);
            return res.status(500).json({ success: false, message: "Lỗi xoá dữ liệu", error: err.sqlMessage });
        }
        res.json({ success: true, message: "Đã xoá thành công" });
    });
});




app.get('/api/yeucau/ghichu/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT GhiChu
        FROM YeuCauTuVan
        WHERE IDYeuCau = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi truy vấn ghi chú:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn ghi chú" });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu" });
        }

        const note = results[0].GhiChu;
        res.json({ success: true, GhiChu: note || null });
    });
});

app.delete('/api/khachhang/:id', (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM KhachHang WHERE ID_KH = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi xóa khách hàng:", err);
            return res.status(500).json({ success: false, message: "Lỗi xóa khách hàng" });
        }
        res.json({ success: true, message: "✅ Xóa khách hàng thành công" });
    });
});


app.get('/api/hoatdongkh', (req, res) => {
    const query = `
        SELECT IDHoatDongKH, IDKhachHang, NoiDungHoatDong 
        FROM HoatDongKhachHang
        ORDER BY IDHoatDongKH DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi truy vấn hoạt động khách hàng:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn" });
        }
        res.json({ success: true, data: results });
    });
});


app.post('/api/hoatdongkh', (req, res) => {
    const { IDKhachHang, NoiDungHoatDong } = req.body;

    if (!IDKhachHang || !NoiDungHoatDong) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin" });
    }

    const IDHoatDongKH = 'HD' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const query = `
        INSERT INTO HoatDongKhachHang (IDHoatDongKH, IDKhachHang, NoiDungHoatDong)
        VALUES (?, ?, ?)
    `;

    db.query(query, [IDHoatDongKH, IDKhachHang, NoiDungHoatDong], (err, result) => {
        if (err) {
            console.error("❌ Lỗi thêm hoạt động:", err);
            return res.status(500).json({ success: false });
        }

        res.json({ success: true });
    });
});


app.put('/api/yeucau/update-status/:id', (req, res) => {
    const { id } = req.params;
    const { TrangThaiYeuCau, ChinhSuaLanCuoiBoi, GhiChu } = req.body;

    const query = `
        UPDATE YeuCauTuVan
        SET TrangThaiYeuCau = ?, 
            GhiChu = ?,
            ChinhSuaLanCuoiVaoLuc = NOW(),
            ChinhSuaLanCuoiBoi = ?
        WHERE IDYeuCau = ?
    `;

    db.query(query, [TrangThaiYeuCau, GhiChu, ChinhSuaLanCuoiBoi, id], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi cập nhật trạng thái yêu cầu:", err);
            return res.status(500).json({ success: false, message: "Lỗi khi cập nhật" });
        }

        res.json({ success: true, message: "✅ Cập nhật thành công!" });
    });
});

// API thống kê tổng hợp
app.get('/api/baocao/thongke', (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM KhachHang) AS SoLuongKH,
            (SELECT COUNT(*) FROM KhachHangTiemNang) AS SoLuongKHTN,
            (SELECT IFNULL(SUM(GiatriHDong), 0) FROM HopDong) AS GiaTriHopDong,
            (SELECT COUNT(*) FROM YeuCauTuVan) AS SoLuongYC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi thống kê:", err);
            return res.status(500).json({ success: false, message: "Lỗi thống kê" });
        }

        res.json({ success: true, data: results[0] });
    });
});




app.put('/api/change-password', (req, res) => {
    const { ID_Nguoidung, Matkhau } = req.body;

    const query = `
        UPDATE TaiKhoanNguoiDung
        SET Matkhau = ?, ChinhSuaLanCuoiVaoLuc = NOW()
        WHERE ID_Nguoidung = ?
    `;

    db.query(query, [Matkhau, ID_Nguoidung], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.json({ success: true });
    });
});


app.put("/api/yeucau/tiepnhan/:id", (req, res) => {
    const { IDNhanVienTiepNhan, TrangThaiYeuCau, ChinhSuaLanCuoiBoi } = req.body;
    const id = req.params.id;

    const query = `
      UPDATE YeuCauTuVan
      SET IDNhanVienTiepNhan = ?, TrangThaiYeuCau = ?, ChinhSuaLanCuoiBoi = ?
      WHERE IDYeuCau = ?
    `;
    db.query(query, [IDNhanVienTiepNhan, TrangThaiYeuCau, ChinhSuaLanCuoiBoi, id], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi cập nhật yêu cầu tư vấn:", err);
            return res.json({ success: false, message: "Lỗi server" });
        }
        res.json({ success: true });
    });
});





// ✅ API lấy toàn bộ yêu cầu tư vấn (dành cho Admin hoặc Nhân viên)
app.get('/api/yeucau/all', (req, res) => {
    const query = `
        SELECT *
        FROM YeuCauTuVan
        ORDER BY NgayGuiYeuCau DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi truy vấn tất cả yêu cầu:", err);
            return res.status(500).json({ success: false, message: "Lỗi khi truy vấn tất cả yêu cầu" });
        }

        res.json({ success: true, data: results });
    });
});

// API lấy danh sách yêu cầu tư vấn theo email người dùng
app.get('/api/yeucau/email/:email', (req, res) => {
    const { email } = req.params;

    const query = `
        SELECT *
        FROM YeuCauTuVan
        WHERE Email = ?
        ORDER BY NgayGuiYeuCau DESC
    `;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi truy vấn yêu cầu tư vấn:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn yêu cầu tư vấn" });
        }

        res.json({ success: true, data: results });
    });
});

app.get('/api/yeucau/taoboi/:idkh', (req, res) => {
    const { idkh } = req.params;
    const query = `
        SELECT * FROM YeuCauTuVan
        WHERE TaoBoi = ?
        ORDER BY NgayGuiYeuCau DESC
    `;
    db.query(query, [idkh], (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn yêu cầu:", err);
            return res.status(500).json({ success: false, message: "Lỗi truy vấn" });
        }
        res.json({ success: true, data: results });
    });
});


app.listen(5000, () => {
  console.log('🚀 Backend đang chạy tại http://localhost:5000');
});
