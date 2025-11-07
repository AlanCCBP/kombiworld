"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(form).some((v) => !v)) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_SERVICE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      console.log("Logged in user:", data);

      setForm({
        email: "",
        password: "",
      });
    } catch (err) {
      console.error("Error al ingresar:", err);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#FFBA38] text-white">
      <Navbar />
      <main className="p-6 sm:p-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Ingresar</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white text-black p-8 rounded-2xl shadow-lg"
        >
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Ingresar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
