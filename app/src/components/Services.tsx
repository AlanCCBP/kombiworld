const services = [
  {
    title: "Charter diario",
    desc: "Viajes programados a tu medida con salida puntual todos los días.",
  },
  {
    title: "Eventos y grupos",
    desc: "Traslados cómodos y seguros para empresas, colegios y particulares.",
  },
  {
    title: "Aeropuerto",
    desc: "Llegá a Ezeiza o Aeroparque sin preocupaciones, a tiempo y con confort.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-[#FFBA38] py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#3D4F63]">Nuestros servicios</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2 text-[#3D4F63]">{s.title}</h3>
            <p className="text-gray-700">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
