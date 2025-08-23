import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import ProductCard from "./ProductCard";
import { ShoppingBag } from "lucide-react";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag size={42} className="text-orange-600" />
            <h1 className="text-3xl font-extrabold text-gray-800">
              Explore Our Products
            </h1>
          </div>
          <p className="text-gray-600 text-center max-w-2xl">
            Discover premium quality products, handpicked just for you.  
            Shop smart, shop easy with{" "}
            <span className="font-semibold text-orange-600">ShopEase</span>.
          </p>
        </div>

        {/* Loading & Error */}
        {loading && (
          <p className="text-center text-gray-600">Loading products...</p>
        )}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {/* Product Grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
    </div>
  );
};

export default Products;
