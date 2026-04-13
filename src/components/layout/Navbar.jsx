import { NavLink } from "react-router-dom"
import { assets } from "../../assets/assets"
import { useState, useEffect } from "react"
import { useAppContext } from "../../context/AppContext"
import { useAuth } from "../../context/AuthContext"
import { useProduct } from "../../context/ProductContext"

const Navbar = () => {
    const { 
        navigate, 
        getCartCount,
    } = useAppContext();
    const { isLoggedIn, logout, setShowLogin, showUserMenu, setShowUserMenu } = useAuth();
    const { searchQuery, setSearchQuery } = useProduct();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if(searchQuery && searchQuery.length > 0){
            navigate('/product');
        }
    }, [searchQuery, navigate]);

    const handleOpenLogin = () => {
        setShowLogin(true);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const toggleUserMenu = (e) => {
        e.stopPropagation(); // Mencegah klik tembus ke elemen lain
        setShowUserMenu((prev) => !prev);
    };

    const handleLogOut = () => {
        logout();
        setShowUserMenu(false);
    }; 

    const getNavLinkClass = ({ isActive }) =>
        `transition hover:text-primary ${
            isActive ? "text-primary font-semibold" : "text-gray-700"
        }`;

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b bg-navbar relative transition-all">
            <NavLink to="/">
                <img className="w-32 sm:w-40" src={assets.logo} alt="Logo" />
            </NavLink>

            <div className={`flex-col items-start sm:flex sm:flex-row sm:items-center sm:gap-8 text-sm ${
                isMobileMenuOpen ? "flex absolute top-[60px] left-0 w-full bg-white shadow-md py-4 px-5 z-20" : "hidden"
            }`}>
                <NavLink to="/" className={getNavLinkClass}>Home</NavLink>
                <NavLink to="/product" className={getNavLinkClass}>All Products</NavLink>
                <NavLink to="/aboutUs" className={getNavLinkClass}>About Us</NavLink>

                <div className="hidden lg:flex items-center gap-2 border border-gray-300 px-3 rounded-full">
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" 
                        type="text" 
                        placeholder="Search products" 
                    />
                    <img className="w-4 h-4" src={assets.search_icon} alt="Search" />
                </div>

                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img className="w-6 h-6" src={assets.cart_icon} alt="Cart" />
                    <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full">
                        {getCartCount()}
                    </span>
                </div>

                {isLoggedIn ? (
                    <div className="relative">
                        <img
                            onClick={toggleUserMenu}
                            className="w-8 h-8 rounded-full cursor-pointer border"
                            src={assets.profile_icon}
                            alt="Profile"
                        />
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                                <NavLink to="/my-orders" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    My Orders
                                </NavLink>
                                <button onClick={handleLogOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleOpenLogin}
                        className="px-8 py-2 bg-primary hover:bg-primary-dark transition text-white rounded-full"
                    >
                        Login
                    </button>
                )}
            </div>

            <button onClick={toggleMobileMenu} className="sm:hidden">
                <img className="w-6 h-6" src={isMobileMenuOpen ? assets.close : assets.menu_icon} alt="Menu" />
            </button>
        </nav>
    );
};

export default Navbar;