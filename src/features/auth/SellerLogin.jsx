import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

export default function SellerLogin() {
  const navigate = useNavigate();
  const { login, isAdmin, loading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userData = await login(email, password);
    
      if (userData.role !== "admin") {
        toast.error("Access denied. Admins only");
        return;
      }
    
      navigate("/admin");
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) return null; // Atau spinner

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 items-start p-10 w-full max-w-md rounded-xl shadow-lg bg-white border border-gray-100"
        autoComplete="off"
      >
        <div className="w-full text-center mb-2">
          <p className="text-3xl font-bold text-gray-800">
            <span className="text-primary">Seller</span> Panel
          </p>
          <p className="text-gray-500 mt-2">Login to manage your products</p>
        </div>

        <div className="w-full">
          <p className="text-sm font-semibold text-gray-700">Email Address</p>
          <input
            className="border border-gray-300 rounded-md w-full p-3 mt-1.5 outline-primary transition-all focus:border-primary"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seller@example.com"
            required
          />
        </div>

        <div className="w-full">
          <p className="text-sm font-semibold text-gray-700">Password</p>
          <input
            className="border border-gray-300 rounded-md w-full p-3 mt-1.5 outline-primary transition-all focus:border-primary"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="bg-primary text-white w-full py-3 rounded-md font-semibold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all disabled:bg-gray-400"
        >
          {isSubmitting ? "Authenticating..." : "Login to Dashboard"}
        </button>
      </form>
    </div>
  );
}