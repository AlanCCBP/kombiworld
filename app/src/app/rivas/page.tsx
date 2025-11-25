import CityLayout from "@/components/CityLayout";

export default function Rivas() {
  const url =
    "//umap.openstreetmap.fr/en/map/suipacha-rivas_1279858?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&editMode=disabled&moreControl=false&searchControl=null&tilelayersControl=false&embedControl=false&datalayersControl=false&onLoadPanel=none&captionBar=false&captionMenus=false&homeControl=false&editinosmControl=false&measureControl=false&locateControl=true&captionControl=false#16/-34.6092/-59.7502";
  return (
    <main className="p-6 sm:p-12 space-y-12 bg-[#182746]">
      <CityLayout
        city="General Rivas"
        mapSrc={url}
        stops={["Plaza Balcarce (Salida)", "Plaza de General Rivas"]}
        schedule={[
          ["06:00", "06:30"],
          ["07:00", "07:30"],
          ["11:00", "11:30"],
          ["12:00", "12:30"],
          ["13:00", "13:30"],
          ["17:30", "18:30"],
          ["20:00", "20:30"],
        ]}
      />
    </main>
  );
}
