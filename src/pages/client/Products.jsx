import { useEffect } from "react"; // Tambahkan useEffect
import ProductCard from "../../components/ProductCard";
import { useProduct } from "../../context/ProductContext";

export default function Products() {
  // Ambil getAvailableProducts dari context
  const { products, searchQuery, getAvailableProducts, loadingProducts } = useProduct();

  // Trigger fetch data saat komponen dimuat
  useEffect(() => {
    getAvailableProducts();
  }, []);

  return (
    <div className="mt-16">
      <h2 className="text-2xl md:text-3xl font-medium uppercase">All Products</h2>
      <div className="h-1 w-20 bg-primary mt-2 rounded"></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        {loadingProducts ? (
           <div className="col-span-full py-10 text-center text-gray-500">
             Loading products...
           </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            <p className="text-gray-500">
              {searchQuery 
                ? `No products found for "${searchQuery}"` 
                : "No products available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}