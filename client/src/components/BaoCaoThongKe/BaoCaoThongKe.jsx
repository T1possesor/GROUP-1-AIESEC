import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./BaoCaoThongKe.scss";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BaoCaoThongKe = () => {
    const [data, setData] = useState(null);
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const [chartSize, setChartSize] = useState("medium");
    const chartRef = useRef(null); // ✅ ref chính xác

    const availableMetrics = [
        { key: "SoLuongKH", label: "Khách hàng" },
        { key: "SoLuongKHTN", label: "Khách hàng tiềm năng" },
        { key: "GiaTriHopDong", label: "Hợp đồng (triệu ₫)", isCurrency: true },
        { key: "SoLuongYC", label: "Yêu cầu tư vấn" },
    ];

    useEffect(() => {
        axios.get("http://localhost:5000/api/baocao/thongke")
            .then((res) => {
                if (res.data.success) setData(res.data.data);
            })
            .catch((err) => console.error("❌ Lỗi khi tải thống kê:", err));
    }, []);

    const toggleMetric = (key) => {
        setSelectedMetrics((prev) =>
            prev.includes(key)
                ? prev.filter((item) => item !== key)
                : [...prev, key]
        );
    };

    const chartData = {
        labels: selectedMetrics.map(
            (key) => availableMetrics.find((m) => m.key === key)?.label
        ),
        datasets: [
            {
                label: "Thống kê",
                backgroundColor: "#3498db",
                data: selectedMetrics.map((key) => {
                    const metric = availableMetrics.find((m) => m.key === key);
                    const rawValue = data[key];
                    return metric?.isCurrency
                        ? Math.round(rawValue / 1000000)
                        : rawValue;
                }),
            },
        ],
    };

    const chartSizeStyle = {
        small: { maxWidth: "400px", height: "250px" },
        medium: { maxWidth: "700px", height: "350px" },
        large: { maxWidth: "1000px", height: "500px" },
    };

    const handleExportChart = () => {
    const canvas = chartRef.current?.canvas;
    if (canvas) {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "bieudo-thongke.png";
        link.click();
    } else {
        alert("⚠ Không thể xuất biểu đồ. Vui lòng thử lại sau.");
    }
};


    return (
        <div className="bao-cao-container">
            <h1>Báo cáo thống kê</h1>
            {!data ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card"><h2>{data.SoLuongKH}</h2><p>Khách hàng</p></div>
                        <div className="stat-card"><h2>{data.SoLuongKHTN}</h2><p>Khách hàng tiềm năng</p></div>
                        <div className="stat-card"><h2>{data.GiaTriHopDong.toLocaleString()} ₫</h2><p>Giá trị hợp đồng</p></div>
                        <div className="stat-card"><h2>{data.SoLuongYC}</h2><p>Yêu cầu tư vấn</p></div>
                    </div>

                    <h3>Chọn dữ liệu để tạo biểu đồ:</h3>
                    <div className="metric-filter">
                        {availableMetrics.map((metric) => (
                            <label key={metric.key}>
                                <input
                                    type="checkbox"
                                    checked={selectedMetrics.includes(metric.key)}
                                    onChange={() => toggleMetric(metric.key)}
                                />
                                {metric.label}
                            </label>
                        ))}
                    </div>

                    <div className="chart-controls">
                        <label>
                            Kích thước biểu đồ:
                            <select value={chartSize} onChange={(e) => setChartSize(e.target.value)}>
                                <option value="small">Nhỏ</option>
                                <option value="medium">Vừa</option>
                                <option value="large">Lớn</option>
                            </select>
                        </label>
                        <button
                            onClick={() => setShowChart(true)}
                            className="btn-create-chart"
                            disabled={selectedMetrics.length === 0}
                        >
                            Tạo biểu đồ
                        </button>
                    </div>

                    {showChart && selectedMetrics.length > 0 && (
                        <>
                            <h3>Biểu đồ thống kê</h3>
                            <div
                                className="chart-wrapper"
                                style={{ ...chartSizeStyle[chartSize], margin: "0 auto" }}
                            >
                                <Bar
    ref={chartRef}
    data={chartData}
    options={{ responsive: true, maintainAspectRatio: false }}
    redraw={true}
/>

                            </div>
                            <button onClick={handleExportChart} className="btn-export">
                                Xuất biểu đồ
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default BaoCaoThongKe;
