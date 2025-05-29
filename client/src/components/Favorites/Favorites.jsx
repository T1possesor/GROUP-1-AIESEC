import { useContext } from "react";
import { MdClose } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { Context } from "../../utils/context";
import "./Favorites.scss";
import prod from "../../assets/products/earbuds-prod-1.webp"; // Import the fallback image
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Favorites = ({ setShowFavorites }) => {
    const { favorites, removeFavorite } = useContext(Context);

    return (
        <div className="favorites-panel">
            <div className="favorites-content">
                <div className="favorites-header">
                    <span className="heading">Favorite Products</span>
                    <span className="close-btn" onClick={() => setShowFavorites(false)}>
                        <MdClose />
                        <span className="text">close</span>
                    </span>
                </div>

                {!favorites?.length && (
                    <div className="empty-favorites">
                        <AiOutlineHeart />
                        <span>No favorite products.</span>
                        <button className="return-cta" onClick={() => setShowFavorites(false)}>RETURN TO SHOP</button>
                    </div>
                )}

                {!!favorites?.length && (
                    <div className="favorites-items">
                        {favorites.map((product) => (
                            <div key={product.id} className="favorite-item">
                                <div className="img-container">
                                    <Link to={`/product/${product.id}`}>
                                        <img src={product.attributes.img?.data[0]?.attributes?.url ? process.env.REACT_APP_DEV_URL + product.attributes.img.data[0].attributes.url : prod} alt={product.attributes.title} />
                                    </Link>
                                </div>
                                <div className="favorite-info">
                                    <Link to={`/product/${product.id}`} className="title">
                                        {product.attributes.title}
                                    </Link>
                                    <span className="price">&#36;{product.attributes.price}</span>
                                    <span className="remove-btn" onClick={() => removeFavorite(product.id)}>
                                        Remove
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
