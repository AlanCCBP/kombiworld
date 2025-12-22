"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token de recuperación inválido o faltante.");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.newPassword || !form.confirmPassword) {
      setError("Por favor completa todos los campos.");
      setLoading(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (form.newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Token inválido.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_USERS_SERVICE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            newPassword: form.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`);
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Error al resetear la contraseña. El link puede haber expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF8554] to-[#FFBA38] p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Nueva contraseña
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Ingresa tu nueva contraseña
          </p>

          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <p className="font-semibold">¡Contraseña actualizada!</p>
                <p className="text-sm mt-2">
                  Tu contraseña ha sido cambiada exitosamente. Serás redirigido al inicio de
                  sesión...
                </p>
              </div>
              <Link
                href="/login"
                className="block text-center text-[#FF8554] hover:text-[#e67647] font-semibold"
              >
                Ir al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8554] focus:border-transparent transition text-black"
                    placeholder="Mínimo 8 caracteres"
                    disabled={loading || !token}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8554] focus:border-transparent transition text-black"
                    placeholder="Repite tu contraseña"
                    disabled={loading || !token}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full bg-gradient-to-r from-[#FF8554] to-[#FFBA38] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Actualizando..." : "Cambiar contraseña"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                <Link
                  href="/login"
                  className="text-[#FF8554] hover:text-[#e67647] font-semibold"
                >
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
