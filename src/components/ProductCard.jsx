import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, cartItem, addCart, removeProductCart, updateCart, navigate } =
    useAppContext();

  if (!product) return null;

  const categoryPath = String(product.category_name || "unknown").toLowerCase();

  // Ambil image utama atau fallback
  const mainImageUrl = 
    product.product_images?.find(img => img.is_main)?.image_url || 
    product.product_images?.[0]?.image_url || 
    assets.default_product_image; 

  const goToDetails = () => {
    navigate(`/product/${categoryPath}/${product.id}`); 
    window.scrollTo(0, 0);
  };


  const handleDecrement = (e) => {
    e.stopPropagation();
    const currentQty = cartItem[product.id];
    if (currentQty > 1) {
      updateCart(product.id, currentQty - 1);
    } else {
      removeProductCart(product.id);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateCart(product.id, cartItem[product.id] + 1);
  };

  return (
    <div
      onClick={goToDetails}
      className="border border-gray-200 rounded-lg md:px-4 px-3 py-3 bg-white min-w-[200px] w-full shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
    >
      {/* Product Image */}
      <div className="group flex items-center justify-center h-40 overflow-hidden">
        <img
          className="group-hover:scale-105 transition-transform max-h-full object-contain"
          src={mainImageUrl} 
          alt={product.name}
        />
      </div>

      <div className="mt-2 flex-grow">
        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">
          {product.category_name}
        </p> 

        <p className="text-gray-800 font-medium text-sm md:text-base truncate w-full">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array(5).fill("").map((_, i) => (
            <img
              key={i}
              src={(product.rating || 5) > i ? assets.star_icon : assets.star_dull_icon}
              alt="star"
              className="w-3 h-3"
            />
          ))}
          <p className="ml-1 text-[10px] text-gray-400">({product.rating || 0})</p>
        </div>
      </div>

      {/* Price & Cart Actions */}
      <div className="flex items-end justify-between mt-3">
        <div>
          <p className="text-base md:text-lg font-bold text-primary leading-none">
            {currency}{product.offer_price?.toLocaleString()}
          </p>
          {product.price > product.offer_price && (
            <p className="text-gray-400 text-[10px] line-through font-normal">
              {currency}{product.price?.toLocaleString()}
            </p>
          )}
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          {!cartItem[product.id] ? ( 
            <button 
              onClick={(e) => { e.stopPropagation(); addCart(product.id); }} 
              className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/30 w-[70px] h-[32px] rounded text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 w-[75px] h-[32px] bg-primary text-white rounded overflow-hidden select-none shadow-sm">
              <button
                onClick={handleDecrement} 
                className="flex-1 h-full hover:bg-black/10 transition font-bold"
              >
                -
              </button>
              <span className="text-xs font-bold">
                {cartItem[product.id]} 
              </span>
              <button
                onClick={handleIncrement}
                className="flex-1 h-full hover:bg-black/10 transition font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;