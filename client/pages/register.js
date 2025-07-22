"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Registered successfully!");
    } else {
      setMessage(data.error || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4 font-bold text-blue-400">Register</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          required
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded">
          Register
        </button>
        {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
      </form>
    </div>
  );
}
