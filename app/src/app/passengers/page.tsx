import Footer from "@/components/Footer";
import NavbarPublic from "@/components/NavbarPublic";
import SideBar from "@/components/Sidebar";
import { MenuItem } from "@/types";
import {
  CalendarClock,
  Car,
  ClipboardList,
  LayoutDashboard,
  Receipt,
  Route,
  UserRound,
  Users,
} from "lucide-react";

export default function Home() {
  const menu: MenuItem[] = [
    {
      label: "Home",
      path: "/company/",
      icon: LayoutDashboard,
    },
    {
      label: "Recorridos y Paradas",
      path: "/company/routes",
      icon: Route,
    },
    {
      label: "Servicios",
      path: "/company/services",
      icon: CalendarClock,
    },
    {
      label: "Conductores",
      path: "/company/drivers",
      icon: Users,
    },
    {
      label: "Pasajeros",
      path: "/company/passengers",
      icon: UserRound,
    },
    {
      label: "Lista de Pasajeros",
      path: "/company/passengerLists",
      icon: ClipboardList,
    },
    {
      label: "Facturación",
      path: "/company/billing",
      icon: Receipt,
    },
    {
      label: "Parque Móvil",
      path: "/company/vehicles",
      icon: Car,
    },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      <NavbarPublic />
      <section>
        <SideBar menuItems={menu} />
        <div></div>
      </section>
      <Footer />
    </main>
  );
}
