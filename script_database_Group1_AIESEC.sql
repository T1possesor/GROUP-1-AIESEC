create database app2n;
use app2n;

CREATE TABLE KhachHang (
    ID_KH VARCHAR(10) NOT NULL PRIMARY KEY,
    HoKH NVARCHAR(15) NOT NULL,
    TenlotKH NVARCHAR(20),
    TenKH NVARCHAR(15) NOT NULL,
    Chucvu NVARCHAR(20),
    Tendonvi NVARCHAR(100),
    Diachi NVARCHAR(255),
    Email NVARCHAR(100),
    SDT CHAR(10),
    NgaytaoKH DATE,
    TrangthaiKH NVARCHAR(30),
    Ghichu NVARCHAR(500),
    ID_NV VARCHAR(10),
    ID_HDong VARCHAR(10),
    ID_TK VARCHAR(10),
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

-- 2. KhachHangTiemNang
CREATE TABLE KhachHangTiemNang (
    IDKHTN VARCHAR(10) NOT NULL PRIMARY KEY,
    HoKHTN NVARCHAR(15),
    TenLotKHTN NVARCHAR(20),
    TenKHTN NVARCHAR(15),
    ChucVu NVARCHAR(50),
    TenDonVi NVARCHAR(100),
    DiaChi NVARCHAR(255),
    Email NVARCHAR(100),
    SoDienThoai CHAR(10),
    IDNhanVien VARCHAR(10),
    GhiChu NVARCHAR(500),
    NgayTaoKHTN DATE,
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

-- 3. NhanVien
CREATE TABLE NhanVien (
    ID_NV VARCHAR(10) NOT NULL PRIMARY KEY,
    HoNV NVARCHAR(15),
    TenlotNV NVARCHAR(20),
    TenNV NVARCHAR(15),
    Ngaysinh DATE,
    Diachi NVARCHAR(255),
    Chucvu NVARCHAR(20),
    SDT CHAR(10),
    Email NVARCHAR(100),
    ID_TK VARCHAR(10),
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

-- 4. HoatDongKhachHang
CREATE TABLE HoatDongKhachHang (
    IDHoatDongKH VARCHAR(10) NOT NULL PRIMARY KEY,
    IDKhachHang VARCHAR(10),
    NoiDungHoatDong NVARCHAR(1000)
);

-- 5. HoatDongKhachHangTiemNang
CREATE TABLE HoatDongKhachHangTiemNang (
    ID_HDKHTN VARCHAR(10) NOT NULL PRIMARY KEY,
    ID_KH VARCHAR(10),
    ID_NV VARCHAR(10),
    Ngaythuchien DATE,
    NoidungHD NVARCHAR(1000),
    Ghichu NVARCHAR(500),
    Trangthai NVARCHAR(30)
);

-- 6. TaiKhoanNguoiDung
CREATE TABLE TaiKhoanNguoiDung (
    ID_Nguoidung VARCHAR(10) NOT NULL PRIMARY KEY,
    Tendangnhap VARCHAR(50),
    Matkhau VARCHAR(255),
    Vaitro NVARCHAR(20),
    Email NVARCHAR(100),
    SDT CHAR(10),
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

-- 7. YeuCauTuVan
CREATE TABLE YeuCauTuVan (
    IDYeuCau VARCHAR(10) NOT NULL PRIMARY KEY,
    Ten NVARCHAR(100),
    Email NVARCHAR(100),
    SoDienThoai CHAR(10),
    NgayGuiYeuCau DATE,
    NoiDungYeuCau NVARCHAR(1000),
    TrangThaiYeuCau NVARCHAR(50),
    IDNhanVienTiepNhan VARCHAR(10),
    Nguon NVARCHAR(50),
    GhiChu NVARCHAR(500),
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

select * from YeuCauTuVan;
ALTER TABLE YeuCauTuVan
MODIFY NgayGuiYeuCau DATETIME DEFAULT CURRENT_TIMESTAMP;

-- 8. BaoGia
CREATE TABLE BaoGia (
    ID_BG VARCHAR(10) NOT NULL PRIMARY KEY,
    ID_GV VARCHAR(50),
    Ngaytao DATE,
    ChitietDV NVARCHAR(1000),
    Tongchiphi FLOAT,
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

-- 9. HoaDonThanhToan
CREATE TABLE HoaDonThanhToan (
    ID_TT VARCHAR(10) NOT NULL PRIMARY KEY,
    ID_KH VARCHAR(10),
    ID_HDong VARCHAR(10),
    Sotien FLOAT,
    PhuongthucTT NVARCHAR(30),
    NgayTT DATE,
    Tinhtrang NVARCHAR(30),
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

-- 10. HopDong
CREATE TABLE HopDong (
    ID_HDong VARCHAR(10) NOT NULL PRIMARY KEY,
    ID_KH VARCHAR(10),
    ID_NV VARCHAR(10),
    TenHDong NVARCHAR(100),
    GiatriHDong FLOAT,
    Ngaybatdau DATE,
    Ngayketthuc DATE,
    Trangthai NVARCHAR(30),
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

-- 11. BaoCaoThongKe
CREATE TABLE BaoCaoThongKe (
    SoLuongKH INT,
    SoLuongKHTN INT,
    GiaTriHopDong FLOAT,
    SoLuongYC INT
);

-- 12. DanhGia
CREATE TABLE DanhGia (
    ID_DG VARCHAR(10) NOT NULL PRIMARY KEY,
    ID_HDong VARCHAR(10),
    ID_KH VARCHAR(10),
    Noidung NVARCHAR(1000),
    Sosao INT,
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

-- 13. PhanHoi
CREATE TABLE PhanHoi (
    ID_PH VARCHAR(10) NOT NULL PRIMARY KEY,
    ID_DG VARCHAR(10),
    ID_NV VARCHAR(10),
    Noidung NVARCHAR(1000),
    TaoVaoLuc DATETIME,
    TaoBoi NVARCHAR(20),
    ChinhSuaLanCuoiVaoLuc DATETIME,
    ChinhSuaLanCuoiBoi NVARCHAR(20)
);

-- 14. HoSoGV
CREATE TABLE HoSoGV (
    ID_GV VARCHAR(50) PRIMARY KEY,
    HoTen VARCHAR(100),
    BangCap VARCHAR(100),
    QuocTich VARCHAR(50),
    Email VARCHAR(100),
    TrangThaiHSGV VARCHAR(50)
);

