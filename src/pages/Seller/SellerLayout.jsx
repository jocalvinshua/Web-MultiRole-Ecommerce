import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const SellerLayout = () => {
  const { isAdmin, logout, loading } = useAuth();
  const navigate = useNavigate();

  const sidebarLinks = [
    { name: "Add Product", path: "/admin", icon: assets.add_icon },
    { name: "Product List", path: "/admin/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
  ];

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
      toast.error("Akses ditolak");
    }
  }, [isAdmin, loading, navigate]);

  const logoutHandler = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      toast.error("Logout gagal");
    }
  };

  if (loading) return null;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-4 md:px-12 border-b border-gray-300 py-3 bg-white sticky top-0 z-10">
        <Link to="/">
          <img
            className="cursor-pointer w-32 md:w-40"
            src={assets.logo}
            alt="logo"
          />
        </Link>
        <div className="flex items-center gap-4 text-gray-600">
          <p className="hidden sm:block font-medium">Hi, Admin!</p>
          <button
            onClick={logoutHandler}
            className="bg-primary text-white text-sm px-6 py-1.5 rounded-full hover:bg-primary/90 transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="md:w-64 w-20 border-r min-h-[calc(100vh-65px)] bg-white border-gray-300 py-4 flex flex-col transition-all">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center py-4 px-6 gap-4 transition-all
                ${
                  isActive
                    ? "border-r-4 border-primary bg-primary/5 text-primary font-semibold"
                    : "border-r-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`
              }
            >
              <img src={item.icon} className="w-6 h-6" alt={item.name} />
              <p className="md:block hidden">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Area Content */}
        <div className="flex-1 p-6 md:p-10 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;