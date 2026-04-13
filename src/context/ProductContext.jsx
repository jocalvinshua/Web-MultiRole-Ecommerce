import { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  addProduct,
  fetchProductsAdmin,
  fetchAvailableProducts,
  updateProductStatus,
  fetchProductById,
  fetchProductsByCategory,
} from "../services/ProductServices.js";
import toast from "react-hot-toast";

const ProductContext = createContext(undefined);

export const ProductContextProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productDetails, setProductDetails] = useState({});

  const getProductDetails = async(productId) => {
    try {
      const data = await fetchProductById(productId);
      console.log("Raw Data from Supabase:", data)
      setProductDetails(data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch product details");
      throw error;
    }
  };

  const getProductsCategory = async(categoryName) => {
    try {
      const data = await fetchProductsByCategory(categoryName);
      return data;
    } catch (error) {
      toast.error("Failed to fetch product details");
      throw error;
    }
  }

  // 1. Ambil data inventory untuk Admin
  const getInventory = async () => {
    try {
      setLoadingProducts(true);
      const data = await fetchProductsAdmin();
      setInventory(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory");
    } finally {
      setLoadingProducts(false);
    }
  };

  // 2. Ambil data produk tersedia untuk Client
  const getAvailableProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await fetchAvailableProducts();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // 3. Tambah Produk Baru
  const createProduct = async (productData, imageUrls) => {
    try {
      setLoadingProducts(true);
      const newProduct = await addProduct(productData, imageUrls);
      
      const formattedProduct = {
        ...newProduct,
        product_images: imageUrls.map((url, index) => ({
          image_url: url,
          is_main: index === 0
        }))
      };

      setInventory((prev) => [formattedProduct, ...prev]); 
      setProducts((prev) => [formattedProduct, ...prev]); 

      toast.success("Product added successfully");
      return formattedProduct;
    } catch (error) {
      toast.error(error.message || "Failed to add product");
      throw error;
    } finally {
      setLoadingProducts(false);
    }
  };

  // 4. Toggle Status Available (Admin)
  const toggleAvailability = async (id, currentStatus) => {
    try {
      await updateProductStatus(id, currentStatus);

      setInventory((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_available: currentStatus } : p))
      );

      if (!currentStatus) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        getAvailableProducts();
      }

      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // 5. Filter Pencarian Client-Side
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.category_name?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  useEffect(() => {
    getAvailableProducts();
  }, []);

  const value = {
    inventory,        
    products: filteredProducts, 
    loadingProducts,
    searchQuery,
    setSearchQuery,
    getInventory,
    getAvailableProducts,
    getProductsCategory,
    createProduct,
    toggleAvailability,
    getProductDetails,
    productDetails,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used inside ProductContextProvider");
  }
  return context;
};