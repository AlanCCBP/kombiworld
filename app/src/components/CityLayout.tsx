import MapboxMap from "./MapboxMap";
import ScheduleTable from "./ScheduleTable";

interface Props {
  city: string;
  mapSrc: string;
  stops: string[];
  schedule: string[][];
}

const CityLayout: React.FC<Props> = ({ city, mapSrc, stops, schedule }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 md:col-start-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">{city}</h1>
          <div className="h-96 border rounded-lg shadow">
            <MapboxMap src={mapSrc} city={city} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-3 mt-8">
          <ScheduleTable stops={stops} schedule={schedule} />
        </div>
      </div>
    </div>
  );
};

export default CityLayout;
