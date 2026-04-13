import supabase from "../app/supabaseClient";


export const uploadProductImage = async (file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Upload error:", error.message);
    throw error;
  }
};

export const addProduct = async (productData, images = []) => {
  try {
    const { name, description, category_name, price, offer_price } = productData;
    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          category_name,
          price: parseFloat(price),
          offer_price: parseFloat(offer_price),
          is_available: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Insert images
    if (images.length > 0) {
      const imageRows = images.map((url, index) => ({
        product_id: product.id,
        image_url: url,
        is_main: index === 0, // Gambar array pertama menjadi gambar utama
      }));

      const { error: imgError } = await supabase
        .from("product_images")
        .insert(imageRows);

      if (imgError) throw imgError;
    }

    return product;
  } catch (error) {
    console.error("Add product error:", error.message);
    throw error;
  }
};

// Fetch products di dashboard admin
export const fetchProductsAdmin = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_url,
        is_main
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Fetch Available products
export const fetchAvailableProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        image_url,
        is_main
      )
    `)
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Update status ketersediaan produk
export const updateProductStatus = async (productId, is_available) => {
  try {
    const { error } = await supabase
      .from("products")
      .update({ is_available })
      .eq("id", productId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Update status error:", error.message);
    throw error;
  }
};

// delete produk
export const deleteProduct = async (productId) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Delete product error:", error.message);
    throw error;
  }
};

// Fetch Products by ID
export const fetchProductById = async (productId) => {
  try {
    // Karena UUID adalah string, kita tidak perlu Number(productId)
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images (
          image_url,
          is_main
        )
      `)
      .eq("id", productId)
      .maybeSingle(); // Mengembalikan null jika tidak ada, bukan error

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Fetch product by ID error:", error.message);
    return null;
  }
};

// Fetch Products by Category
export const fetchProductsByCategory = async (categoryName) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images (
          image_url,
          is_main
        )
      `)
      .eq("category_name", categoryName)
      .eq("is_available", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Fetch products by category error:", error.message);
    throw error;
  }
};