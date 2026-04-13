import { useState } from "react";
import { categories } from "../../assets/assets";
import toast from "react-hot-toast";
import { useProduct } from "../../context/ProductContext";
import { uploadProductImage, addProduct } from "../../services/ProductServices.js";
import { assets } from "../../assets/assets";

const AddProduct = () => {
  const [files, setFiles] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const { createProduct } = useProduct();

  const cate = categories; 

  const handleImageChange = (index, file) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = objectUrl;
      return newPreviews;
    });

    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = file;
      return newFiles;
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    const validFiles = files.filter(f => f !== null);

    if (validFiles.length === 0) {
      return toast.error("Harap tambahkan setidaknya satu gambar");
    }

    setLoading(true);
    try {
      const uploadedUrls = await Promise.all(
        validFiles.map(file => uploadProductImage(file))
      );

      const productData = {
        name,
        description,
        category_name: category,
        price: Number(price),
        offer_price: Number(offerPrice),
      };

      await createProduct(productData, uploadedUrls);

      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setOfferPrice("");
      setFiles([null, null, null, null]);
      setPreviews(["", "", "", ""]);
      toast.success("Produk berhasil ditambahkan");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noScrollBar flex-1 h-[95vh] overflow-y-scroll">
      <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="font-medium mb-2">Upload product images</p>
          <div className="flex gap-3 flex-wrap">
            {previews.map((src, index) => (
              <label key={index} className="relative">
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                />
                <img
                  src={src || assets.upload_area}
                  className="w-24 h-24 object-cover border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-all"
                />
              </label>
            ))}
          </div>
        </div>

        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded outline-primary"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded outline-primary resize-none"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded outline-primary"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c, i) => (
            <option key={i} value={c.path}>
              {c.path}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded outline-primary"
            required
          />
          <input
            type="number"
            placeholder="Offer Price"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            className="w-full border p-2 rounded outline-primary"
            required
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded font-medium disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "ADD PRODUCT"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;