import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  src: string;
  city: string;
}

const MapboxMap: React.FC<Props> = ({ src, city }) => {
  return (
    <div className="aspect-video w-full rounded-xl shadow overflow-hidden h-full">
      <iframe
        src={src}
        className="w-full h-full"
        allowFullScreen
        loading="lazy"
        title={`Mapa de ${city}`}
      />
    </div>
  );
};

export default MapboxMap;
