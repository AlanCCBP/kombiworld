"use client";

import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    docNumber: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (Object.values(form).some((v) => !v)) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const userData = {
      user: {
        ...form,
        docType: 0,
      },
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_SERVICE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      alert("✅ Registro exitoso");
      setForm({
        firstName: "",
        lastName: "",
        docNumber: "",
        email: "",
        phone: "",
        birthdate: "",
        address: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      alert("❌ Error al registrar el usuario. Intenta nuevamente.");
    }
  };

  return (
    <main className="p-6 sm:p-12 max-w-3xl mx-auto bg-[#FFBA38]">
      <h1 className="text-3xl font-bold text-center mb-8">Crear nueva cuenta</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white text-black p-8 rounded-2xl shadow-lg"
      >
        <div>
          <label className="block text-sm font-semibold mb-2">Nombre</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Apellido</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Número de DNI</label>
          <input
            type="text"
            name="docNumber"
            value={form.docNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Número de teléfono</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Fecha de nacimiento</label>
          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-2">Dirección</label>
          <input
            type="text"
            name="address"
            value={form.address}
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

        <div>
          <label className="block text-sm font-semibold mb-2">Repetir contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Registrarse
          </button>
        </div>
      </form>
    </main>
  );
}
