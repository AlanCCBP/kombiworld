const steps = [
  {
    title: "Buscá tu recorrido",
    desc: "Ingresá origen y destino y encontrá viajes disponibles.",
  },
  {
    title: "Compará opciones",
    desc: "Elegí entre distintas empresas, horarios y precios.",
  },
  {
    title: "Reservá fácil",
    desc: "Confirmá tu lugar en pocos pasos, sin vueltas.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#FFBA38] py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-14 text-[#3D4F63]">
        ¿Cómo funciona KombiWorld?
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((s, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-3 text-[#3D4F63]">
              {s.title}
            </h3>
            <p className="text-gray-700">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
