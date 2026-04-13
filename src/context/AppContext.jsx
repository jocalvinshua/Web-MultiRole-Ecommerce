import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "./AuthContext";
import { useProduct } from "./ProductContext";
import { addToCart, fetchCartItems, removeFromCart, updateCartItem, clearCart } from "../services/CartService.js";
import { addOrderWithItems, fetchOrderByUserId, fetchAllOrders } from "../services/OrderService.js";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const { user, isLoggedIn } = useAuth();
  const { products } = useProduct();

  const [cartItem, setCartItem] = useState({})
  const [myOrders, setMyOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn && user && products.length > 0) {
        try {
          const data = await fetchCartItems(user.id);
          const cartData = {};
          data.forEach(item => {
            cartData[item.product_id] = item.quantity;
          });
          setCartItem(cartData); 
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
    };

    loadCart();
    loadUserOrders();
    loadAllOrders();
  }, [isLoggedIn, user?.id, products]);

  const addToCartLocal = async (productId) => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }
    try {
      const newQty = (cartItem[productId] || 0) + 1;
      await addToCart(user.id, productId, newQty);
      setCartItem(prev => ({ ...prev, [productId]: newQty }));
      toast.success("Berhasil ditambah");
    } catch (error) {
      toast.error("Gagal menambah ke keranjang");
    }
  };

  // 3. Fungsi Update Cart
  const updateCartLocal = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeProductCart(productId);
        return;
      }
      await updateCartItem(user.id, productId, quantity);
      setCartItem(prev => ({ ...prev, [productId]: quantity }));
    } catch (error) {
      toast.error("Gagal update keranjang");
    }
  };

  // 4. Fungsi Remove Product
  const removeProductCart = async (productId) => {
    try {
      await removeFromCart(user.id, productId);
      setCartItem(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
      toast.success("Produk dihapus");
    } catch (error) {
      toast.error("Gagal menghapus produk");
    }
  };

  const getCartCount = () => Object.values(cartItem).reduce((a, b) => a + b, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItem) {
      const itemInfo = products.find(p => String(p.id) === String(id));
      if (itemInfo) {
        total += itemInfo.offer_price * cartItem[id];
      }
    }
    return total;
  };

  const placeOrder = async (addressData) => {
    if (!isLoggedIn) return toast.error("Please login to continue");

    try {
        const orderData = {
            user_id: user.id,
            total_amount: getCartAmount() * 1.02,
            shipping_address: addressData,
            payment_method: 'COD'
        };
        const orderItems = Object.entries(cartItem)
            .filter(([_, qty]) => qty > 0)
            .map(([productId, qty]) => {
                const product = products.find(p => String(p.id) === String(productId));
                return {
                    product_id: productId,
                    quantity: qty,
                    unit_price: product.offer_price
                };
            });

        if (orderItems.length === 0) throw new Error("Cart is empty");
        await addOrderWithItems(orderData, orderItems);
        await clearCart(user.id);
        setCartItem({});
        // Debugging purpose
        // console.log("Order placed:", orderData, orderItems);
        toast.success("Order placed successfully!");
        // navigate('/my-orders');
        
        loadUserOrders(); 

    } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to place order");
    }
  };

  const loadUserOrders = async () => {
    if (isLoggedIn && user?.id) { // Pastikan user.id ada
        try {
            // console.log("Fetching orders for user:", user.id);
            const data = await fetchOrderByUserId(user.id);
            // console.log("Orders received from Supabase:", data);
            setMyOrders(data || []);
        } catch (error) {
            console.error("Error loading orders:", error);
        }
    }
  };

  const loadAllOrders = async()=>{
    try {
        // Logika tambahan: Anda bisa mengecek role admin di sini sebelum fetch
        const data = await fetchAllOrders();
        setAllOrders(data);
    } catch (error) {
        console.error("Admin fetch error:", error);
    }
  }

  const value = {
    currency, navigate, cartItem, addCart: addToCartLocal, updateCart: updateCartLocal, removeProductCart: removeProductCart, 
    fetchCartItems: fetchCartItems,
    placeOrder,
    loadUserOrders,
    myOrders,
    allOrders, loadAllOrders,
    getCartCount, getCartAmount, products, isLoggedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);