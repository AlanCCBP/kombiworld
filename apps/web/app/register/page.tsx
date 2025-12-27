"use client";

import { useState } from "react";

type Step = 1 | 2;

export default function Register() {
  const [step, setStep] = useState<Step>(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    docNumber: "",
    email: "",
    phone: "",
    birthdate: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, password, confirmPassword } = form;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Completá todos los campos.");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { docNumber, phone, birthdate } = form;
    if (!docNumber || !phone || !birthdate) {
      alert("Completá todos los campos.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const userData = {
      user: {
        ...form,
        docType: 0,
      },
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Error al registrar usuario");

      const data = await response.json();
      if (data.token) localStorage.setItem("authToken", data.token);
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass = `
    w-full p-2 border border-gray-200 rounded-lg
    transition
    hover:border-orange-300
    focus:outline-none focus:border-orange-400
  `;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FF8554] to-[#FFBA38] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Crear cuenta</h1>
          <p className="text-gray-600 text-sm">Paso {step} de 2</p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="········"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Repetir contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="········"
                className={inputClass}
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="
                w-full h-14 rounded-lg font-semibold text-white
                bg-linear-to-r from-[#FF8554] to-[#FFBA38]
                hover:opacity-90 transition
              "
            >
              Continuar →
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">DNI</label>
              <input
                name="docNumber"
                value={form.docNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 h-14 rounded-lg border font-semibold hover:bg-gray-50 transition"
              >
                ← Volver
              </button>

              <button
                type="submit"
                className="
                  w-2/3 h-14 rounded-lg font-semibold text-white
                  bg-linear-to-r from-[#FF8554] to-[#FFBA38]
                  hover:opacity-90 transition
                "
              >
                Crear cuenta
              </button>
            </div>
          </>
        )}
      </form>
    </main>
  );
}
