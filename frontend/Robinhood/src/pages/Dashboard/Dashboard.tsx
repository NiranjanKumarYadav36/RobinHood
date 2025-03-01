import React from "react";
import Map from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import GetLocation from "../../components/ui/location/Getlocation";
import LocationGenerator from "../../components/ui/LocationGenerator/LocationGenerator";
import Header from "../../components/ui/Header/header";
import Footer from "../../components/ui/Footer/footer";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"; // 🚀 More vibrant style

const MapComponent: React.FC = () => {
  return (
    <div className="w-full h-screen md:h-[800px]">
        <Header/>
      <Map
        mapStyle={MAP_STYLE}
        initialViewState={{
          longitude: 72,
          latitude: 19,
          zoom: 15,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <GetLocation />
        <LocationGenerator/>
      </Map>
      <Footer/>
    </div>
  );
};

export default MapComponent;
