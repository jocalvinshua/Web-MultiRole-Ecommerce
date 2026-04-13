import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

export default function Cart() {
  const [showAddress, setShowAddress] = useState(false);
  const {
    products,
    navigate,
    currency,
    cartItem,
    removeFromCart,
    getCartCount,
    updateCart,
    getCartAmount,
    placeOrder, // Fungsi ini di AppContext sudah menangani simpan ke database
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  
  const dummyAddress = [
    { street: "Jl. Mawar No. 123", city: "Jakarta Selatan" },
    { street: "Komp. Hijau Blok C", city: "Bandung" }
  ];
  
  const [addresses] = useState(dummyAddress);
  const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]);
  const [paymentOption] = useState("COD"); // Kita fokus ke COD dulu
  const [loading, setLoading] = useState(false);

  // Mengubah cartItem (object) menjadi Array untuk tampilan UI
  const getCart = () => {
    if (!products || products.length === 0) return;
    
    const tempArray = [];
    for (const key in cartItem) {
      if (cartItem[key] > 0) {
        const product = products.find(
          (item) => String(item.id) === String(key)
        );
        if (product) {
          tempArray.push({ ...product, quantity: cartItem[key] });
        }
      }
    }
    setCartArray(tempArray);
  };

  useEffect(() => {
  if (products && products.length > 0 && Object.keys(cartItem).length > 0) {
    const tempArray = [];
    for (const key in cartItem) {
      if (cartItem[key] > 0) {
        const product = products.find(
          (item) => String(item.id) === String(key)
        );
        if (product) {
          tempArray.push({ ...product, quantity: cartItem[key] });
        }
      }
    }
    setCartArray(tempArray);
  } else if (Object.keys(cartItem).length === 0) {
    setCartArray([]); // Pastikan array kosong jika cart kosong
  }
}, [products, cartItem]);

  const handlePlaceOrder = async () => {
    if (cartArray.length === 0) {
      toast.error("Keranjang Anda kosong!");
      return;
    }

    setLoading(true);
    try {
      const addressString = `${selectedAddress.street}, ${selectedAddress.city}`;
      
      await placeOrder(addressString);
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat pesanan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-16 gap-10 px-4 md:px-0">
      <div className="flex-1">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary font-normal">{getCartCount()} Items</span>
        </h1>

        {cartArray.length === 0 ? (
          <div className="py-10 text-center md:text-left">
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
            <button 
              onClick={() => navigate("/")} 
              className="mt-5 text-primary font-medium border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition inline-flex items-center gap-2"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[3fr_1fr_1fr] text-gray-400 text-sm uppercase font-bold border-b pb-2">
              <p>Product</p>
              <p className="text-center">Subtotal</p>
              <p className="text-right">Action</p>
            </div>

            {cartArray.map((product, index) => {
              const displayImage = 
                product.product_images?.find(img => img.is_main)?.image_url || 
                product.product_images?.[0]?.image_url || 
                assets.placeholder_image;

              const categoryPath = String(product.category_name || "unknown")
                .toLowerCase()
                .replace(/\s+/g, '-');

              return (
                <div key={index} className="grid grid-cols-[3fr_1fr_1fr] items-center border-b pb-6 gap-2">
                  <div className="flex items-center gap-4">
                    <img 
                      onClick={() => navigate(`/product/${categoryPath}/${product.id}`)}
                      src={displayImage} 
                      className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition" 
                      alt={product.name}
                    />
                    <div>
                      <p className="font-medium text-gray-800 leading-tight mb-1">{product.name}</p>
                      <p className="text-xs text-gray-500 mb-2 uppercase">{product.category_name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Qty:</span>
                        <select
                          className="border rounded px-1 outline-none bg-white cursor-pointer"
                          value={product.quantity}
                          onChange={(e) => updateCart(product.id, parseInt(e.target.value))}
                        >
                          {[...Array(10).keys()].map(i => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-center font-semibold text-gray-700">
                    {currency}{(product.offer_price * product.quantity).toLocaleString()}
                  </p>

                  <div className="text-right">
                    <button 
                      onClick={() => removeFromCart(product.id)} 
                      className="p-2 hover:bg-red-50 group rounded-full transition"
                    >
                      <img src={assets.remove_icon} className="w-5 h-5 opacity-40 group-hover:opacity-100" alt="remove"/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar Summary */}
      <div className="w-full md:w-[350px] h-fit bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
        
        <div className="space-y-3 text-gray-600 border-b pb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency}{getCartAmount().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600 font-medium italic">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (2%)</span>
            <span>{currency}{(getCartAmount() * 0.02).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-between text-xl font-bold py-4">
          <span>Total</span>
          <span className="text-primary">{currency}{(getCartAmount() * 1.02).toLocaleString()}</span>
        </div>

        {/* Address Selection */}
        <div className="mt-4">
           <p className="text-xs font-bold text-gray-400 uppercase mb-2">Delivery Address</p>
           <div className="p-3 bg-white border border-gray-200 rounded-xl text-sm relative">
             <p className="pr-14 text-gray-700 leading-snug">
               {selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}` : "Please set an address"}
             </p>
             <button onClick={() => setShowAddress(!showAddress)} className="absolute right-3 top-3 text-primary text-xs font-bold hover:underline">Change</button>
             
             {showAddress && (
               <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 shadow-xl z-50 rounded-xl overflow-hidden">
                 {addresses.map((addr, i) => (
                   <div 
                    key={i} 
                    onClick={() => { setSelectedAddress(addr); setShowAddress(false); }} 
                    className="p-3 hover:bg-primary/5 cursor-pointer border-b border-gray-50 last:border-0 text-gray-600 transition"
                   >
                     {addr.street}, {addr.city}
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={cartArray.length === 0 || loading}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold mt-8 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
        >
          {loading ? "PROCESSING..." : "PLACE ORDER (COD)"}
        </button>
      </div>
    </div>
  );
}