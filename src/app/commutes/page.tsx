import ScheduleTable from "@/components/ScheduleTable";

export default function Commutes() {
  return (
    <main className="p-6 sm:p-12 space-y-12 bg-[#182746]">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center text-white">Combinaciones</h1>
      <section>
        <h3 className="text-4xl md:text-6md font-bold mb-6 text-center text-white">
          Chivilcoy - Mercedes
        </h3>
        <ScheduleTable
          stops={[
            "Universidad de Luján",
            "CUCH",
            "Plaza 25 de Mayo",
            "Plaza España",
            "Gorostiaga (Sentido a Suipacha)",
            "Plaza Balcarce (Llegada)",
            "Plaza Balcarce (Salida)",
            "Terminal de Mercedes",
            "Instituto Superior Ciudad de Mercedes",
            "Centro Universitario Regional",
            "Plaza San Martín",
          ]}
          schedule={[
            [
              "08:35",
              "08:50",
              "08:55",
              "09:00",
              "09:15",
              "09:35",
              "10:00",
              "10:30",
              "10:35",
              "10:40",
              "10:50",
            ],
            [
              "16:35",
              "16:50",
              "16:55",
              "17:00",
              "17:15",
              "17:35",
              "18:00",
              "18:30",
              "18:35",
              "18:40",
              "18:50",
            ],
          ]}
        />
      </section>
      <section>
        <h3 className="text-4xl md:text-6md font-bold mb-6 text-center text-white">
          Mercedes - Chivilcoy
        </h3>
        <ScheduleTable
          stops={[
            "Terminal de Mercedes",
            "Instituto Superior Ciudad de Mercedes",
            "Centro Universitario Regional",
            "Plaza San Martín",
            "Plaza Balcarce (Llegada)",
            "Plaza Balcarce (Salida)",
            "Gorostiaga (Sentido a Chivilcoy)",
            "Universidad de Luján",
            "CUCH",
            "Plaza 25 de Mayo",
            "Plaza España",
          ]}
          schedule={[
            [
              "10:30",
              "10:35",
              "10:40",
              "10:50",
              "11:30",
              "12:00",
              "12:20",
              "12:35",
              "12:50",
              "12:55",
              "13:00",
            ],
          ]}
        />
      </section>
      <section>
        <h3 className="text-4xl md:text-6md font-bold mb-6 text-center text-white">
          Chivilcoy - General Rivas
        </h3>
        <ScheduleTable
          stops={[
            "Universidad de Luján",
            "CUCH",
            "Plaza 25 de Mayo",
            "Plaza España",
            "Gorostiaga (Sentido a Chivilcoy)",
            "Plaza Balcarce (Llegada)",
            "Plaza Balcarce (Salida)",
            "Plaza de General Rivas",
          ]}
          schedule={[["08:35", "08:50", "08:55", "09:00", "09:15", "09:35", "11:00", "11:25"]]}
        />
      </section>
      <section>
        <h3 className="text-4xl md:text-6md font-bold mb-6 text-center text-white">
          General Rivas - Chivilcoy
        </h3>
        <ScheduleTable
          stops={[
            "Plaza de General Rivas",
            "Plaza Balcarce (Llegada)",
            "Plaza Balcarce (Salida)",
            "Gorostiaga (Sentido a Chivilcoy)",
            "Universidad de Luján",
            "CUCH",
            "Plaza 25 de Mayo",
            "Plaza España",
          ]}
          schedule={[
            ["11:00", "11:25", "12:00", "12:20", "12:35", "12:50", "12:55", "13:00"],
            ["18:30", "18:55", "19:00", "19:20", "19:35", "19:50", "19:55", "20:00"],
            ["20:30", "20:55", "21:30", "21:50", "22:05", "22:20", "22:25", "22:30"],
          ]}
        />
      </section>
      <section>
        <h3 className="text-4xl md:text-6md font-bold mb-6 text-center text-white">
          Mercedes - General Rivas
        </h3>
        <ScheduleTable
          stops={[
            "Terminal de Mercedes",
            "Instituto Superior Ciudad de Mercedes",
            "Centro Universitario Regional",
            "Plaza San Martín",
            "Plaza Balcarce (Llegada)",
            "Plaza Balcarce (Salida)",
            "Plaza de General Rivas",
          ]}
          schedule={[
            ["10:30", "10:35", "10:40", "10:50", "11:30", "12:00", "12:25"],
            ["15:30", "15:35", "15:40", "15:50", "16:30", "17:30", "17:55"],
            ["18:30", "18:35", "18:40", "18:50", "19:30", "20:00", "20:25"],
          ]}
        />
      </section>
      <section>
        <h3 className="text-4xl md:text-6md font-bold mb-6 text-center text-white">
          General Rivas - Mercedes
        </h3>
        <ScheduleTable
          stops={[
            "Plaza de General Rivas",
            "Plaza Balcarce (Llegada)",
            "Plaza Balcarce (Salida)",
            "Terminal de Mercedes",
            "Instituto Superior Ciudad de Mercedes",
            "Centro Universitario Regional",
            "Plaza San Martín",
          ]}
          schedule={[
            ["06:30", "06:55", "07:00", "07:30", "07:35", "07:40", "07:50"],
            ["20:30", "20:55", "21:30", "22:00", "22:05", "22:10", "20:20"],
          ]}
        />
      </section>
    </main>
  );
}
