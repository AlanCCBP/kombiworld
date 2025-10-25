import Navbar from "@/components/Navbar";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen font-sans bg-white text-white">
      <Navbar />
      <main className="p-6 sm:p-12 space-y-12 items-center justify-items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center text-[#FF6666]">
          Términos y Condiciones del Servicio
        </h1>
        <section className="text-[#FF6666]">
          <ul>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-[#FF6666] w-5 h-5" />
              Menores de 3 años (inclusive), no abonan pasaje.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-[#FF6666] w-5 h-5" />
              Nuestro horario de atención para reservaciones es de <b>07:00 a 20:00Hs</b>. Por fuera
              del horario, <b>no brindamos garantías</b> de que podamos procesar la reserva hasta el
              día siguiente a partir de las <b>07:00Hs</b>.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-[#FF6666] w-5 h-5" />
              Recomendamos reservar pasajes <b>hasta una hora antes</b> de la salida del servicio
              <b>desde Suipacha</b>.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-[#FF6666] w-5 h-5" />
              Nos reservamos el derecho de cancelar el servicio que no tenga reservaciones
              realizadas una hora antes de la salida del servicio desde Suipacha.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-[#FF6666] w-5 h-5" />
              En tal caso, será publicado como Estado de WhatsApp, stories en redes, y será indicado
              en nuestra sección{" "}
              <Link href="/status">
                <b>Estado del Servicio</b>
              </Link>
              .
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
