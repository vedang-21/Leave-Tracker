import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// deployment fix
const API_BASE = "https://leave-tracker-z363.onrender.com";

export default function Login() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔒 Prevent logged-in users from seeing login
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);

      navigate("/dashboard");

    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-900 dark:to-slate-950">
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-80">
        
        <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🔐 Forgot Password Link */}
        <div className="text-right mb-6">
          <Link
            to="/forgot-password"
            className="text-indigo-600 hover:underline text-sm dark:text-indigo-400"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center dark:text-slate-300">
          Don't have an account?{" "}
          <span
            className="text-indigo-600 cursor-pointer dark:text-indigo-400"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}