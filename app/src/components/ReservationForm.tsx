"use client";

import { useState } from "react";

const ReservationForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    fromCity: "",
    toCity: "",
    fromStop: "",
    toStop: "",
    schedule: "",
  });

  enum cityNames {
    CHIVILCOY = "Chivilcoy",
    MERCEDES = "Mercedes",
    RIVAS = "General Rivas",
    SUIPACHA = "Suipacha",
  }

  interface Stop {
    name: string;
    additionalMinutes: Number;
  }

  interface Trip {
    name: string;
    stops: Stop[];
    schedule: string[];
  }

  const trips: Trip[] = [
    {
      name: cityNames.CHIVILCOY,
      stops: [
        { name: "Universidad de Luján", additionalMinutes: 35 },
        { name: "Av. Mitre y Calle 92", additionalMinutes: 35 },
        { name: "Plaza Moreno", additionalMinutes: 40 },
        { name: "Plaza 9 de Julio/Anfiteatro", additionalMinutes: 45 },
        { name: "Plaza 25 de Mayo", additionalMinutes: 55 },
        { name: "Av. 22 de Octubre y Av. Avellaneda", additionalMinutes: 45 },
        { name: "Plaza España", additionalMinutes: 60 },
      ],
      schedule: ["08:00", "12:00", "16:00", "19:00", "21:30"],
    },
    {
      name: cityNames.MERCEDES,
      stops: [
        { name: "Terminal Mercedes", additionalMinutes: 30 },
        { name: "Instituto Superior Ciudad de Mercedes", additionalMinutes: 35 },
        { name: "Centro Universitario Regional Mercedes", additionalMinutes: 40 },
        { name: "Plaza San Martín", additionalMinutes: 50 },
        { name: "29 y 16 / Sagrada Familia", additionalMinutes: 55 },
        { name: "Colegio San Benito", additionalMinutes: 30 },
        { name: "Centro Oftalmológico", additionalMinutes: 30 },
        { name: "29 y 30", additionalMinutes: 50 },
      ],
      schedule: ["07:00", "10:00", "15:00", "18:00", "21:30"],
    },
    {
      name: cityNames.SUIPACHA,
      stops: [
        { name: "Plaza Balcarce", additionalMinutes: 0 },
        { name: "Acceso Suipacha", additionalMinutes: 5 },
        { name: "Brady y Tucumán", additionalMinutes: 5 },
        { name: "Brady y Antártida", additionalMinutes: 5 },
        { name: "Brady y Salta", additionalMinutes: 5 },
        { name: "Brady y 1º de Mayo", additionalMinutes: 0 },
      ],
      schedule: ["07:00", "08:00", "12:00", "16:00", "19:00", "21:30"],
    },
    {
      name: cityNames.RIVAS,
      stops: [
        { name: "Acceso a General Rivas", additionalMinutes: 0 },
        { name: "Plaza de Gral. Rivas", additionalMinutes: 0 },
      ],
      schedule: [
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "17:30",
        "18:30",
        "20:00",
        "20:30",
      ],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const message = `*Nombre y apellido:* ${form.firstName} ${form.lastName}
                     *DNI:* ${form.dni}
                     *Teléfono:* ${form.phone}
                     *Sube en:* ${form.fromStop}
                     *Baja en:* ${form.toStop}
                     *Horario:* ${form.schedule}Hs.`;

    const phoneNumber = "5491170614444";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="max-w-md mx-auto  p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold mb-4">Reservar viaje</h2>

      <input
        type="text"
        name="firstName"
        placeholder="Nombre"
        value={form.firstName}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="lastName"
        placeholder="Apellido"
        value={form.lastName}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="dni"
        placeholder="DNI"
        value={form.dni}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="phone"
        placeholder="Teléfono"
        value={form.phone}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <select
        name="fromCity"
        value={form.fromCity}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Ciudad de origen</option>
        {trips
          .sort((a: Trip, b: Trip) => (a.name > b.name ? 1 : -1))
          .map((trip: Trip, idx) => (
            <option key={idx} value={trip.name}>
              {trip.name}
            </option>
          ))}
      </select>

      {form.fromCity !== null && form.fromCity !== "" && (
        <select
          name="fromStop"
          value={form.fromStop}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Parada de origen</option>
          {trips
            .find((trip: Trip) => trip.name === form.fromCity)
            ?.stops.map((stop) => (
              <option key={stop.name} value={stop.name}>
                {stop.name}
              </option>
            ))}
        </select>
      )}

      {form.fromStop !== null && form.fromStop !== "" && (
        <select
          name="schedule"
          value={form.schedule}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccione horario de partida</option>
          {trips
            .find((trip: Trip) => trip.name === form.fromCity)
            ?.schedule.map((a: string, idx: number) => (
              <option key={idx} value={a}>
                {a}
              </option>
            ))}
        </select>
      )}

      <select
        name="toCity"
        value={form.toCity}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        disabled={!form.fromCity}
        required
      >
        <option value="">Ciudad de destino</option>
        {trips
          .filter((a: Trip) => a.name !== form.fromCity)
          .sort((a: Trip, b: Trip) => (a.name > b.name ? 1 : -1))
          .map((trip: Trip, idx) => (
            <option key={idx} value={trip.name}>
              {trip.name}
            </option>
          ))}
      </select>

      {form.toCity !== null && form.toCity !== "" && (
        <select
          name="toStop"
          value={form.toStop}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Parada de destino</option>
          {trips
            .find((trip: Trip) => trip.name === form.toCity)
            ?.stops.map((stop) => (
              <option key={stop.name} value={stop.name}>
                {stop.name}
              </option>
            ))}
        </select>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        disabled={
          Object.values(form).filter((entry: string) => entry === null || entry === "").length > 0
        }
      >
        Reservar ahora
      </button>
    </div>
  );
};

export default ReservationForm;
