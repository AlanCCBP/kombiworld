interface StatusBoardProps {
  city: string;
  schedule: { hour: string; status: "ok" | "cancelled" }[];
}

const StatusBoard: React.FC<StatusBoardProps> = ({ city, schedule }) => {
  return (
    <div className="bg-black shadow rounded-lg p-4 w-full max-w-3xl">
      <h2 className="text-xl font-semibold mb-3">{city}</h2>
      <table className="min-w-full border-collapse text-sm text-center overflow-x-auto">
        <thead>
          <tr>
            {schedule.map((item, i) => (
              <th key={i} className="p-2 border-b border-gray-200">
                {item.hour}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {schedule.map((item, i) => (
              <td key={i} className="p-2">
                <span
                  className={`inline-block w-4 h-4 rounded-full ${
                    item.status === "ok" ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={item.status === "ok" ? "Normal" : "Cancelado"}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatusBoard;
