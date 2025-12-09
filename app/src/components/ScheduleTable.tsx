interface Props {
  stops: string[];
  schedule: string[][];
}

const ScheduleTable: React.FC<Props> = ({ stops, schedule }) => {
  return (
    <div className="border rounded-lg shadow overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            {stops.map((stop, i) => (
              <th key={i} className="border border-gray-300 p-2 font-bold text-center text-xl">
                {stop}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, i) => (
            <tr key={i}>
              {row.map((hour, j) => (
                <td key={j} className="border border-gray-300 p-2 font-bold text-center">
                  {hour}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
