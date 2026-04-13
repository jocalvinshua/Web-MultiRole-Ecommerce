import supabase from "../app/supabaseClient";

// Add Order
export const addOrderWithItems = async (orderData, orderItems) => {
    try {
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        if (orderError) throw orderError;

        const itemsWithId = orderItems.map(item => ({
            ...item,
            order_id: order.id
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsWithId);

        if (itemsError) throw itemsError;

        return order;
    } catch (error) {
        console.error("Error in addOrderWithItems:", error);
        throw error;
    }
}

export const fetchOrderByUserId = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    unit_price,
                    products (
                        name,
                        product_images ( image_url )
                    )
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw error;
    }
}

// Fetch All Orders (Admin Purpose)
export const fetchAllOrders = async () => {
    try {
        const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                quantity,
                unit_price,
                products ( name )
            )
        `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error;
    }
}   