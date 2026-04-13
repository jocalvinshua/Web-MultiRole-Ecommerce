import { useEffect } from "react";
import { useProduct } from "../../context/ProductContext";

const ProductList = () => {
  const { inventory, getInventory, toggleAvailability } = useProduct();

  useEffect(() => {
    getInventory();
  }, []);

  return (
    <div className="noScrollBar flex-1 h-[95vh] overflow-y-scroll bg-gray-50">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-6 text-2xl font-semibold text-gray-800">Inventory Management</h2>

        {inventory.length === 0 ? (
          <p className="text-gray-500 text-center py-10 bg-white border rounded-xl">No products in inventory.</p>
        ) : (
          <div className="max-w-5xl bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium text-center">Availability</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
                {inventory.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img
                        src={product.product_images?.[0]?.image_url || "/placeholder.png"}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        {/* Status Label Dinamis */}
                        <span className={`text-[10px] font-bold uppercase w-12 ${product.is_available ? 'text-green-600' : 'text-gray-400'}`}>
                          {product.is_available ? 'Active' : 'Hidden'}
                        </span>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={product.is_available}
                            onChange={() => toggleAvailability(product.id, !product.is_available)}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer 
                            peer-focus:ring-2 peer-focus:ring-green-300 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all 
                            peer-checked:after:translate-x-full peer-checked:bg-green-500 transition-all duration-300">
                          </div>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;