import { useParams, useNavigate } from "react-router-dom";
import "./Category.scss";
import Products from "../Products/Products";
import useFetch from "../../hooks/useFetch";

const Category = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useFetch(`/api/products?populate=*&[filters][categories][id]=${id}`);

    return (
        <div className="category-main-content">
            <div className="layout">
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                <div className="category-title">
                    {data?.data?.[0]?.attributes?.categories?.data?.[0]?.attributes?.title}
                </div>
                <Products innerPage={true} products={data} />
            </div>
        </div>
    );
};

export default Category;
