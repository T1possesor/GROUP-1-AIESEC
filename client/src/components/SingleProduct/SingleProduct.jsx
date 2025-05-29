import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RelatedProducts from "./RelatedProducts/RelatedProducts";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPinterest, FaCartPlus, FaHeart, FaArrowLeft } from "react-icons/fa";
import prod from "../../assets/products/earbuds-prod-1.webp";
import "./SingleProduct.scss";
import useFetch from "../../hooks/useFetch";
import { Context } from "../../utils/context";

const SingleProduct = () => {
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const navigate = useNavigate(); // Sử dụng hook useNavigate
    const { data } = useFetch(`/api/products?populate=*&[filters][id]=${id}`);
    const { handleAddToCart, addFavorite, removeFavorite, favorites, user } = useContext(Context);

    const increment = () => {
        setQuantity((prevState) => prevState + 1);
    };

    const decrement = () => {
        setQuantity((prevState) => {
            if (prevState === 1) return 1;
            return prevState - 1;
        });
    };

    // Kiểm tra xem dữ liệu có tồn tại và đúng định dạng hay không trước khi tiếp tục
    if (!data || !data.data || data.data.length === 0) return <div>Loading...</div>;
    const product = data.data[0].attributes;

    // Kiểm tra thêm để đảm bảo product.img và các thuộc tính liên quan tồn tại
    const imageUrl = product.img?.data[0]?.attributes?.url ? process.env.REACT_APP_DEV_URL + product.img.data[0].attributes.url : prod;

    const handleAddToCartClick = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        handleAddToCart(data.data[0], quantity);
        setQuantity(1);
    };

    const handleFavoriteClick = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        const isFavorite = favorites.find((fav) => fav.id === data.data[0].id);
        if (isFavorite) {
            removeFavorite(data.data[0].id);
        } else {
            addFavorite(data.data[0]);
        }
    };

    const isFavorite = favorites.find((fav) => fav.id === data.data[0].id);

    return (
        <div className="single-product-main-content">
            <div className="layout">
                <div className="single-product-page">
                    <div className="left">
                        <img src={imageUrl} alt={product.title || 'Product Image'} />
                        {/* Nút back để quay lại trang trước đó */}
                        <button className="back-button" onClick={() => navigate(-1)}>
                            <FaArrowLeft size={16} />
                            Back
                        </button>
                    </div>
                    <div className="right">
                        <span className="name">{product.title || 'No title'}</span>
                        <span className="price">&#36;{product.price || 'No price'}</span>
                        <span className="desc">{product.desc || 'No description available'}</span>

                        <div className="cart-buttons">
                            <div className="quantity-buttons">
                                <span onClick={decrement}>-</span>
                                <span>{quantity}</span>
                                <span onClick={increment}>+</span>
                            </div>
                            <button className="add-to-cart-button" onClick={handleAddToCartClick}>
                                <FaCartPlus size={20} />
                                ADD TO CART
                            </button>
                        </div>

                        <span className="divider" />

                        <div className="info-item">
                            <span className="text-bold">
                                Category:{" "}
                                <span>{product.categories.data[0].attributes.title}</span>
                            </span>
                            <span className="favorite-icon" onClick={handleFavoriteClick}>
                                <FaHeart size={20} color={isFavorite ? 'red' : 'grey'} />
                            </span>
                            <span className="text-bold">
                                Share:
                                <span className="social-icons">
                                    <FaFacebookF size={16} />
                                    <FaTwitter size={16} />
                                    <FaInstagram size={16} />
                                    <FaLinkedinIn size={16} />
                                    <FaPinterest size={16} />
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <RelatedProducts 
                    productId={id} 
                    categoryId={product.categories.data[0].id}
                />
            </div>
        </div>
    );
};

export default SingleProduct;
