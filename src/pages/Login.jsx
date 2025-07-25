// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200"
      >
        <img
          src="./public/logo.jpg"
          alt="logo"
          className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login to TaskTrackr</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded transition"
        >
          Login
        </button>
        <p className="text-sm mt-6 text-center">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
