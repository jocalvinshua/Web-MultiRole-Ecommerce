import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import { useEffect, useState } from 'react';
import { assets } from '../../assets/assets.js';
import ProductCard from '../../components/ProductCard.jsx';
import { useProduct } from '../../context/ProductContext.jsx';

const ProductDetails = () => {
  const { currency, addCart } = useAppContext(); 
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductDetails, productDetails, products } = useProduct();

  const [productData, setProductData] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findProduct = async () => {
      // console.log("Mencari UUID:", id);
      setLoading(true);
      try {
        const data = await getProductDetails(id);
        // console.log("Data Product Ditemukan:", data);
        setProductData(data);
      } catch (error) {
        console.error("Error UI:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) findProduct();
  }, [id]);
  
  // Jika masih loading dan data products global belum ada
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <span className="ml-3">Fetching Product...</span>
      </div>
    );
  }

  // Jika loading selesai tapi produk tidak ditemukan
  if (!productData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <button onClick={() => navigate('/product')} className="mt-4 text-primary underline">
          Back to all products
        </button>
      </div>
    );
  }

  const relatedProducts = products.filter(
    (item) => item.category_name === productData.category_name && String(item.id) !== String(id)
  );

  const handleAddToCart = () => {
    addCart(productData.id);
  };

  const handleBuyNow = () => {
    addCart(productData.id);
    navigate('/cart');
  };

  return (
    <div className="mt-12 px-6 md:px-16 lg:px-24 animate-fadeIn">
      {/* Breadcrumbs */}
      <p className="text-sm text-gray-500 mb-6">
        <Link to={'/'} className="hover:text-primary">Home</Link> /
        <Link to={'/product'} className="hover:text-primary"> Products</Link> /
        <span className="text-primary capitalize"> {productData.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-12 mt-4">
        {/* GALERI GAMBAR */}
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-3">
          <div className="flex md:flex-col gap-3 overflow-x-auto overflow-y-hidden md:overflow-y-auto max-h-[500px] no-scrollbar">
            {productData.product_images?.map((imgObj, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(imgObj.image_url)}
                className={`border-2 min-w-[80px] md:w-24 rounded overflow-hidden cursor-pointer transition-all ${
                  thumbnail === imgObj.image_url ? 'border-primary' : 'border-transparent bg-gray-50'
                }`}
              >
                <img src={imgObj.image_url} alt="" className="w-full h-24 object-cover" />
              </div>
            ))}
          </div>

          <div className="border border-gray-100 w-full md:flex-1 aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-sm">
            <img 
              src={thumbnail || assets.placeholder_image} 
              alt={productData.name} 
              className="w-full h-full object-contain p-4 transition-all duration-500" 
            />
          </div>
        </div>

        {/* INFO PRODUK */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-3">
            {Array(5).fill('').map((_, i) => (
              <img 
                key={i} 
                className="w-4" 
                src={i < Math.floor(productData.rating || 4) ? assets.star_icon : assets.star_dull_icon} 
                alt="" 
              />
            ))}
            <p className="text-sm ml-2 text-gray-400">({productData.rating || '4.0'})</p>
          </div>

          <div className="mt-8 mb-8">
             <div className="flex items-baseline gap-3">
                <p className="text-4xl font-extrabold text-primary">{currency}{Number(productData.offer_price).toLocaleString()}</p>
                <p className="text-gray-400 line-through text-lg">{currency}{Number(productData.price).toLocaleString()}</p>
             </div>
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-800">Deskripsi Produk</p>
            <p className="text-gray-600 leading-relaxed">{productData.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center mt-12 gap-4">
            <button 
              onClick={handleAddToCart} 
              className="w-full py-4 bg-gray-900 text-white hover:bg-black active:scale-95 transition-all rounded-lg font-bold"
            >
              Tambah ke Keranjang
            </button>
            <button 
              onClick={handleBuyNow} 
              className="w-full py-4 bg-primary text-white hover:brightness-110 active:scale-95 transition-all rounded-lg font-bold shadow-lg shadow-primary/30"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;