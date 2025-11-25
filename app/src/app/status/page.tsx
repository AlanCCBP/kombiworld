import StatusBoard from "@/components/StatusDashboard";

export default function Status() {
  return (
    <main className="p-6 sm:p-12 space-y-12 flex flex-col items-center bg-[#FFBA38] text-white">
      <StatusBoard
        city="Chivilcoy"
        schedule={[
          { hour: "08:00", status: "ok" },
          { hour: "12:00", status: "ok" },
          { hour: "16:00", status: "cancelled" },
          { hour: "19:00", status: "ok" },
          { hour: "21:30", status: "ok" },
        ]}
      />
      <StatusBoard
        city="Mercedes"
        schedule={[
          { hour: "07:00", status: "ok" },
          { hour: "10:00", status: "ok" },
          { hour: "15:00", status: "cancelled" },
          { hour: "18:00", status: "ok" },
          { hour: "21:30", status: "ok" },
        ]}
      />
      <StatusBoard
        city="Rivas"
        schedule={[
          { hour: "06:00", status: "ok" },
          { hour: "07:00", status: "ok" },
          { hour: "11:00", status: "ok" },
          { hour: "12:00", status: "ok" },
          { hour: "13:00", status: "ok" },
          { hour: "17:30", status: "ok" },
          { hour: "20:00", status: "ok" },
        ]}
      />
    </main>
  );
}
