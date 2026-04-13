import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

export default function MyOrders() {
  const { currency, myOrders } = useAppContext();

  return (
    <div className="mt-16 px-4 md:px-0 max-w-5xl mx-auto">
      <div className="flex flex-col items-end w-max mb-8">
        <h1 className="text-2xl md:text-3xl font-medium uppercase">My Orders</h1>
        <div className="w-16 h-0.5 rounded-full bg-primary"></div>
      </div>

      {myOrders.length === 0 ? (
        <p className="text-center text-xl text-gray-500 p-10">No orders found.</p>
      ) : (
        myOrders.map((order) => (
          <div key={order.id} className='border border-gray-300 rounded-lg mb-10 overflow-hidden shadow-sm'>
            <div className="flex justify-between items-center text-sm text-gray-500 bg-gray-50 p-4 border-b">
              <span className="font-mono">Order ID: {order.id.slice(0, 8)}...</span>
              <span className="font-bold text-gray-800">
                Total: {currency}{Number(order.total_amount).toLocaleString()}
              </span>
            </div>

            <div className="p-4 space-y-6">
              {order.order_items?.map((item, idx) => {
                const product = item.products;
                const displayImage = product?.product_images?.[0]?.image_url || assets.placeholder_image;

                return (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <img 
                        src={displayImage} 
                        className="w-20 h-20 object-cover rounded bg-gray-100 border" 
                        alt={product?.name}
                      />
                      <div>
                        <h2 className="font-semibold text-gray-800 text-lg">{product?.name || "Product Deleted"}</h2>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} | Price: {currency}{Number(item.unit_price).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">{order.status}</p>
                      </div>
                      <p className="text-xs text-gray-400">Method: {order.payment_method}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}