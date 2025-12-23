export default function ForWho() {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

                {/* Pasajeros */}
                <div className="p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-[#3D4F63]">
                        Para pasajeros
                    </h3>
                    <p className="text-gray-700 mb-4">
                        Encontrá viajes en combi de distintas empresas,
                        compará alternativas y reservá sin complicaciones.
                    </p>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Más opciones en un solo lugar</li>
                        <li>Horarios flexibles</li>
                        <li>Reservas rápidas</li>
                    </ul>
                </div>

                {/* Empresas */}
                <div className="p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-[#3D4F63]">
                        Para empresas de combis
                    </h3>
                    <p className="text-gray-700 mb-4">
                        Publicá tus recorridos, gestioná reservas y llegá
                        a más pasajeros sin intermediarios.
                    </p>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Más visibilidad</li>
                        <li>Gestión centralizada</li>
                        <li>Menos viajes vacíos</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
