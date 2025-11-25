import CityLayout from "@/components/CityLayout";

export default function Chivilcoy() {
  const url =
    "//umap.openstreetmap.fr/en/map/suipacha-chivilcoy_1279692?scaleControl=false&miniMap=false&scrollWheelZoom=true&zoomControl=true&editMode=disabled&moreControl=false&searchControl=false&tilelayersControl=false&embedControl=false&datalayersControl=false&onLoadPanel=none&captionBar=false&captionMenus=false&homeControl=false&captionControl=false&locateControl=true&measureControl=false&editinosmControl=false&printControl=null#13/-34.8965/-60.0125";

  return (
    <main className="p-6 sm:p-12 space-y-12 bg-[#FF6666] text-white">
      <CityLayout
        city="Chivilcoy"
        mapSrc={url}
        stops={[
          "Plaza Balcarce (Salida)",
          "Gorostiaga (Sentido a Chivilcoy)",
          "Universidad de Luján",
          "CUCH",
          "Plaza 25 de Mayo",
          "Plaza España",
          "Gorostiaga (Sentido a Suipacha)",
          "Plaza Balcarce (Llegada)",
        ]}
        schedule={[
          ["08:00", "08:20", "08:35", "08:50", "08:55", "09:00", "09:15", "09:35"],
          ["12:00", "12:20", "12:35", "12:50", "12:55", "13:00", "13:15", "13:35"],
          ["16:00", "16:20", "16:35", "16:50", "16:55", "17:00", "17:15", "17:35"],
          ["19:00", "19:20", "19:35", "19:50", "19:55", "20:00", "20:15", "20:35"],
          ["21:30", "21:50", "22:05", "22:20", "22:25", "22:30", "22:45", "23:05"],
        ]}
      />
    </main>
  );
}
