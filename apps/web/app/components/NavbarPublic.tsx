"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MenuItem } from "@/types";

export default function NavbarPublic() {
  const [open, setOpen] = useState(false);

  const menu: MenuItem[] = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Registro",
      path: "/register",
    },
    {
      label: "Ingresar",
      path: "/login",
    },
  ];

  return (
    <nav className="bg-[#3D4F63] text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo KombiWorld" className="h-10 w-10" />
            <span className="font-bold text-lg">KombiWorld</span>
          </div>
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
          {menu.map(({ label, path, icon: Icon }, i) => (
            <Link
              href={path}
              className="flex items-center gap-3 p-2 rounded-md transition-colors"
              key={i}
            >
              <span>{label}</span>
            </Link>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-4 flex flex-col space-y-4">
          {menu.map(({ label, path }, i) => (
            <Link
              href={path}
              className="flex items-center gap-3 p-2 rounded-md transition-colors"
              key={i}
              onClick={() => setOpen(false)}
            >
              <span>{label}</span>
            </Link>
          ))}
          <a
            href="#cta"
            className="bg-[#FF8554] px-4 py-2 rounded-lg hover:bg-orange-600 text-center"
            onClick={() => setOpen(false)}
          >
            Registrarse
          </a>
          <a
            href="#cta"
            className="bg-[#FF8554] px-4 py-2 rounded-lg hover:bg-orange-600 text-center"
            onClick={() => setOpen(false)}
          >
            Ingresar
          </a>
        </div>
      )}
    </nav>
  );
}
