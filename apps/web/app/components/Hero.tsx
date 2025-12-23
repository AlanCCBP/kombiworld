import ReservationForm from "./ReservationForm";

export default function Hero() {
  return (
    <section className="bg-[#FF8554] text-white text-center flex flex-col items-center justify-center py-28 px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Reservá viajes en combi, en un solo lugar
      </h1>

      <p className="max-w-3xl text-lg md:text-xl mb-10">
        Buscá por origen y destino, compará opciones de distintas empresas
        y reservá tu viaje de forma simple y segura.
      </p>

      <ReservationForm />

      <p className="mt-6 text-sm opacity-90">
        Viajes de corta y larga distancia · Empresas verificadas
      </p>
    </section>
  );
}
