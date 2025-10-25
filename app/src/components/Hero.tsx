import ReservationForm from "./ReservationForm";

export default function Hero() {
  return (
    <section className="bg-[#FF8554] text-white text-center flex flex-col items-center justify-center py-24 px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Tu viaje comienza aquí</h1>
      <p className="max-w-2xl text-lg mb-8">
        Traslados cómodos, seguros y puntuales para que viajes sin preocupaciones.
      </p>
      <ReservationForm />
    </section>
  );
}
