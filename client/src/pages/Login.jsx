import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔒 Prevent logged-in users from seeing login
  if (token) {
    window.location.href = "/dashboard";
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:7777/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);

      window.location.href = "/dashboard";
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>
        <p className="text-sm mt-4 text-center">
  Don't have an account?{" "}
  <span
    className="text-indigo-600 cursor-pointer"
    onClick={() => navigate("/register")}
  >
    Register
  </span>
</p>
      </div>
    </div>
  );
}