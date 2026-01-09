"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { CompanySelector } from "@/components/CompanySelector";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  if (loading) return null;

  return (
    <nav className="bg-[#3D4F63] text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" alt="Logo KombiWorld" className="h-10 w-10" />
            <span className="font-bold text-lg">KombiWorld</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {!user && (
            <>
              <Link href="/register">Registro</Link>
              <Link href="/login">Ingresar</Link>
            </>
          )}

          {user && (
            <>
              <CompanySelector />
              <span className="text-sm text-gray-200">Hola {user.firstName ?? user.email}</span>
              <button onClick={logout} className="text-sm text-red-300 hover:underline">
                Logout
              </button>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden mt-4 flex flex-col space-y-4">
          {!user && (
            <>
              <Link href="/register" onClick={() => setOpen(false)}>
                Registro
              </Link>
              <Link href="/login" onClick={() => setOpen(false)}>
                Ingresar
              </Link>
            </>
          )}
          {user && (
            <>
              <CompanySelector />

              <span className="text-sm text-gray-200">Hola {user.firstName ?? user.email}</span>

              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="text-left text-red-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
