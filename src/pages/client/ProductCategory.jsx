import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { categories } from "../../assets/assets";
import ProductCard from "../../components/ProductCard";
import { useProduct } from "../../context/ProductContext";
import { useMemo } from "react";

export default function ProductCategory() {
  const { products } = useProduct();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path?.toLowerCase() === category?.toLowerCase()
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const catName = String(product.category_name || "").toLowerCase();
      return catName === category || catName.replace(/\s+/g, '-') === category;
    });
  }, [products, category]);

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max mb-6">
          <h2 className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </h2>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            // Pastikan menggunakan product.id
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-primary">
            No Product In This Category
          </p>
          <p className="text-gray-400 text-sm">Category: {category}</p>
        </div>
      )}
    </div>
  );
}