import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext.jsx";

const Orders = () => {
  const { currency, allOrders, loadAllOrders } = useAppContext();

  useEffect(() => {
    loadAllOrders();
  }, []);

  return (
    <div className="md:p-10 p-4 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-bold text-gray-700">All Customer Orders</h2>

      {allOrders.length === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-white border rounded-xl">
          No orders received yet.
        </div>
      ) : (
        allOrders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1.5fr_1fr_1fr] gap-6 items-start border border-gray-200 p-6 rounded-xl bg-white shadow-sm"
          >
            {/* Kolom 1: Icon */}
            <img className="w-12 h-12 opacity-70" src={assets.parcel_icon || assets.box_icon} alt="Order" />

            {/* Kolom 2: Info Produk & User ID */}
            <div className="text-sm">
              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Items</p>
                {order.order_items?.map((item, i) => (
                  <p key={i} className="font-semibold text-gray-800">
                    • {item.products?.name} <span className="text-primary text-xs">x{item.quantity}</span>
                  </p>
                ))}
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Customer Info</p>
                <p className="text-gray-800 font-medium">User ID: <span className="text-gray-500 font-mono text-[11px]">{order.user_id}</span></p>
              </div>
            </div>

            {/* Kolom 3: Shipping Address */}
            <div className="text-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Shipping Address</p>
              <div className="text-gray-600 leading-relaxed">
                {/* Jika shipping_address berupa JSON/Object */}
                {typeof order.shipping_address === 'object' ? (
                  <>
                    <p className="font-bold text-gray-800">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                    <p>{order.shipping_address.street}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipcode}</p>
                  </>
                ) : (
                  /* Jika shipping_address berupa String */
                  <p className="whitespace-pre-line">{order.shipping_address || "No address provided"}</p>
                )}
              </div>
            </div>

            {/* Kolom 4: Pembayaran */}
            <div className="text-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Payment</p>
              <p className="font-bold text-lg text-gray-900">
                {currency}{Number(order.total_amount || 0).toLocaleString()}
              </p>
              <p className="text-gray-500 font-medium">{order.payment_method}</p>
            </div>

            {/* Kolom 5: Waktu & Status */}
            <div className="text-sm space-y-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Order Date</p>
                <p className="text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;