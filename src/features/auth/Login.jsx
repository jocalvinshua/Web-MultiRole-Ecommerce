import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [state, setState] = useState("login"); 
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setShowLogin } = useAuth();
  const { login, register } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "login") {
        await login(email, password);
        setShowLogin(false);
      } else {
        if (!full_name || !email || !password) {
          return toast.error("Semua field wajib diisi");
        }
        await register(full_name, email, password);
        setState("login"); 
      }
    } catch (error) {
      console.error("Auth Error:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] backdrop-blur-sm">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 p-8 w-80 sm:w-[352px] bg-white rounded-xl shadow-2xl border animate-fadeIn"
      >
        <div className="w-full flex justify-end">
          <X className="w-6 h-6 cursor-pointer text-gray-400 hover:text-black transition" onClick={() => setShowLogin(false)} />
        </div>

        <p className="text-2xl font-semibold text-center text-gray-800">
          {state === "login" ? "User Login" : "Create Account"}
        </p>

        {state === "register" && (
          <div>
            <p className="text-sm font-medium mb-1">Full Name</p>
            <input
              type="text"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              className="border rounded-md w-full p-2.5 outline-primary text-sm"
              placeholder="Jhon Doe"
              required
            />
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-1">Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md w-full p-2.5 outline-primary text-sm"
            placeholder="example@mail.com"
            required
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md w-full p-2.5 outline-primary text-sm"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white py-2.5 rounded-md hover:opacity-90 transition font-medium mt-2"
        >
          {state === "register" ? "Sign Up" : "Login"}
        </button>

        <p className="text-sm text-center text-gray-600">
          {state === "register" ? (
            <>Already have an account? <span className="text-primary cursor-pointer font-medium" onClick={() => setState("login")}>Login here</span></>
          ) : (
            <>New here? <span className="text-primary cursor-pointer font-medium" onClick={() => setState("register")}>Create account</span></>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;