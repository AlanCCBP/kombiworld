"use client";

import Link from "next/link";
import { useState } from "react";

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
    <main className="max-w-screen min-h-screen bg-gradient-to-br from-[#FF8554] to-[#FFBA38] p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        // className="grid grid-cols-1 gap-6 bg-white text-black p-8 rounded-2xl shadow-lg"
        className="grid grid-cols-1 gap-6 bg-white text-black p-8 rounded-2xl shadow-lg -translate-y-[20%] w-full sm:max-w-[120%] md:max-w-[500px]"
      >
        <div>
          <h1 className="text-3xl font-bold text-center mb-2">Bienvenido</h1>
          <h2 className="text-md text-center text-gray-600">Inicia sesión en tu cuenta</h2>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-lg hover:border-orange-300 transition focus:outline-none"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-200 rounded-lg hover:border-orange-300 transition focus:outline-none"
            placeholder="········"
          />
        </div>
        <div>
          <h2 className="text-orange-400 text-sm hover:text-orange-500">¿Olvidaste tu contraseña?</h2>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-orange-300 bg-linear-to-r from-[#FF8554] to-[#FFBA38] font-semibold text-white py-3 rounded-lg hover:bg-orange-400 transition"
          >
            Ingresar
          </button>
        </div>
        <div>
          <h2 className="text-sm text-gray-700">¿Todavía no tenés una cuenta? <Link href="/register" className="text-orange-400 text-sm font-semibold hover:text-orange-500">Registrate</Link></h2>
        </div>
      </form>
    </main>
  );
}
