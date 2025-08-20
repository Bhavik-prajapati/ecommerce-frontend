import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import ProductCard from "./ProductCard";

const Products = () => {
  const dispatch = useDispatch();

  // Get products state from Redux
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        Products
      </h1>

      {loading && (
        <p className="text-center text-gray-600">Loading products...</p>
      )}

      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products && products.length > 0 ? (
          <ProductCard products={products} />
        ) : (
          !loading &&
          !error && (
            <p className="col-span-full text-center text-gray-500">
              No products available
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Products;
