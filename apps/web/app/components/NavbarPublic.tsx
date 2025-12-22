"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { MenuItem } from "@/types";
import { useAuth } from "../context/AuthContext";

export default function NavbarPublic() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const publicMenu: MenuItem[] = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Chivilcoy",
      path: "/chivilcoy",
    },
    {
      label: "Mercedes",
      path: "/mercedes",
    },
    {
      label: "General Rivas",
      path: "/rivas",
    },
    {
      label: "Combinaciones",
      path: "/commutes",
    },
    {
      label: "Estado de los servicios",
      path: "/status",
    },
  ];

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <nav className="bg-[#3D4F63] text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo KombiWorld" className="h-10 w-10" />
            <span className="font-bold text-lg">KombiWorld</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {publicMenu.map(({ label, path }, i) => (
            <Link
              href={path}
              className="hover:text-[#FFBA38] transition-colors"
              key={i}
            >
              {label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#4A5F7A] rounded-lg">
                <User size={18} />
                <span className="text-sm">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-3 ml-4">
              <Link
                href="/login"
                className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-[#3D4F63] transition-colors"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-[#FF8554] rounded-lg hover:bg-[#e67647] transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col space-y-4">
          {publicMenu.map(({ label, path }, i) => (
            <Link
              href={path}
              className="p-2 hover:bg-[#4A5F7A] rounded-md transition-colors"
              key={i}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 p-2 bg-[#4A5F7A] rounded-md">
                <User size={18} />
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="p-2 bg-white text-[#3D4F63] text-center rounded-lg hover:opacity-90"
                onClick={() => setOpen(false)}
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="p-2 bg-[#FF8554] text-center rounded-lg hover:bg-[#e67647]"
                onClick={() => setOpen(false)}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
