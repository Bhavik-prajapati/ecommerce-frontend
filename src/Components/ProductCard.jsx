import CryptoJS from "crypto-js";
import "./common.css"
import { useNavigate } from 'react-router-dom';
import { addToCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";

const ProductCard = ({ products }) => {
    const navigate = useNavigate();
    const dispatch=useDispatch();

    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

    return (
        <>
            {products.map(product => (
                <div key={product.id} className="card">
                    <img src={product.image_url} alt={product.name} className="card-image" />
                    <div className="card-body">
                        <h3 className="card-title">{product.name}</h3>
                        <p className="card-text">{product.description}</p>
                        <p className="card-price">{product.price}</p>
                        <div className='btns'>


                            <button
                                onClick={() =>
                                    navigate(
                                        `/product/${encodeURIComponent(
                                            CryptoJS.AES.encrypt(product.id.toString(), SECRET_KEY).toString()
                                        )}`
                                    )
                                }
                            >
                                View
                            </button>
                             <button onClick={() => dispatch(addToCart({product_id:`${product.id}`,quantity:1}))}>
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ProductCard