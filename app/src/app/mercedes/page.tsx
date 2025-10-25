import CityLayout from "@/components/CityLayout";
import Navbar from "@/components/Navbar";

export default function Mercedes() {
  const url =
    "//umap.openstreetmap.fr/en/map/suipacha-mercedes_1279811?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&editMode=disabled&moreControl=false&searchControl=false&tilelayersControl=false&embedControl=false&datalayersControl=false&onLoadPanel=none&captionBar=false&captionMenus=false&homeControl=false&captionControl=false&locateControl=true&measureControl=false&editinosmControl=false&printControl=null";

  return (
    <div className="min-h-screen font-sans bg-[#FFBA38] text-white">
      <Navbar />
      <main className="p-6 sm:p-12 space-y-12">
        <CityLayout
          city="Mercedes"
          mapSrc={url}
          stops={[
            "Plaza Balcarce (Salida)",
            "Terminal de Mercedes",
            "Instituto Superior Ciudad de Mercedes",
            "Centro Universitario Regional",
            "Plaza San Martín",
            "Plaza Balcarce (Llegada)",
          ]}
          schedule={[
            ["07:00", "07:30", "07:35", "07:40", "07:50", "08:20"],
            ["10:00", "10:30", "10:35", "10:40", "10:50", "11:20"],
            ["15:00", "15:30", "15:35", "15:40", "15:50", "16:20"],
            ["18:00", "18:30", "18:35", "18:40", "18:50", "19:20"],
            ["21:30", "22:00", "22:05", "22:10", "22:20", "22:55"],
          ]}
        />
      </main>
    </div>
  );
}
