import ProductCard from "../../components/ProductCard";
import { useProduct } from "../../context/ProductContext";

export default function BestSellers() {
  const { products } = useProduct();

  return (
    <div className="mt-16">
      <h2 className="text-2xl md:text-3xl font-medium">Best Sellers</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        {products
          .filter((product) => product.is_available) 
          .slice(0, 5)
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}