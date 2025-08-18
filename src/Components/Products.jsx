import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice"; // adjust path if needed
import ProductCard from "./ProductCard";
import "./common.css";

const Products = () => {
  const dispatch = useDispatch();

  // Get products state from Redux
  const { products, loading, error } = useSelector((state) => state.product);

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-center">Products</h1>

      {/* Loading state */}
      {loading && <p className="text-center">Loading products...</p>}

      {/* Error state */}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Products list */}
      <div className="product-area">
        {products && products.length > 0 ? (
          <ProductCard products={products} />
        ) : (
          !loading && !error && (
            <p className="text-center">No products available</p>
          )
        )}
      </div>
    </div>
  );
};

export default Products;
