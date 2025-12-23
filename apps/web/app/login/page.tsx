"use client";

import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Por favor completá todos los campos.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_USERS_SERVICE_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      setForm({ email: "", password: "" });
    } catch (err) {
      console.error("Error al ingresar:", err);
      alert("Email o contraseña incorrectos.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FF8554] to-[#FFBA38] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6 md:-translate-y-[20%]"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Bienvenido</h1>
          <p className="text-gray-600 text-sm">
            Iniciá sesión en tu cuenta
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="
              w-full p-2 border border-gray-200 rounded-lg
              transition
              hover:border-orange-300
              focus:outline-none focus:border-orange-400
            "
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="········"
            className="
              w-full p-2 border border-gray-200 rounded-lg
              transition
              hover:border-orange-300
              focus:outline-none focus:border-orange-400
            "
          />
        </div>

        {/* Forgot password */}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-orange-400 text-sm hover:text-orange-500"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="
            w-full h-14 rounded-lg font-semibold text-white
            bg-linear-to-r from-[#FF8554] to-[#FFBA38]
            hover:opacity-90 transition
          "
        >
          Ingresar
        </button>

        {/* Register */}
        <p className="text-sm text-center text-gray-700">
          ¿Todavía no tenés una cuenta?{" "}
          <Link
            href="/register"
            className="text-orange-400 font-semibold hover:text-orange-500"
          >
            Registrate
          </Link>
        </p>
      </form>
    </main>
  );
}
