import { useState } from "react";
import "./Products.scss";
import Product from "./Product/Product";

const Products = ({ products, innerPage, headingText }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Tính toán tổng số trang
    const totalPages = Math.ceil(products?.data?.length / productsPerPage);

    // Lấy danh sách sản phẩm cho trang hiện tại
    const currentProducts = products?.data?.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    // Hàm chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Hàm để tạo danh sách các nút trang
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i ? "active" : ""}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="products-container">
            {!innerPage && <div className="sec-heading">{headingText}</div>}
            <div className="products">
                {currentProducts?.map((item) => (
                    <Product 
                        key={item.id} 
                        id={item.id} 
                        data={item.attributes} 
                    />
                ))}
            </div>
            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {renderPageNumbers()}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Products;
