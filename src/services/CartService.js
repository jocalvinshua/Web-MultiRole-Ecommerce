import supabase from "../app/supabaseClient";

// Add to cart_items
export const addToCart = async (userId, productId, quantity) => {
  const { data, error } = await supabase
    .from("cart_items")
    .upsert({ user_id: userId, product_id: productId, quantity }, { onConflict: 'user_id, product_id' })
    .select();
    if (error) throw error;
    return data;
};

// Remove from cart_items
export const removeFromCart = async (userId, productId) => {
  const { data, error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
    if (error) throw error;
    return data;
};
// Get cart_items items
export const fetchCartItems = async (userId) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      product_id, quantity,
      products (
        id, name, offer_price, product_images ( image_url )
        )
    `)
    .eq("user_id", userId);
    if (error) throw error;
    return data;
};

// Update cart_items item quantity
export const updateCartItem = async (userId, productId, quantity) => {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId);
    if (error) throw error;
    return data;
};
// Clear cart_items after order
export const clearCart = async (userId) => {
  const { data, error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);
    if (error) throw error;
    return data;
}
