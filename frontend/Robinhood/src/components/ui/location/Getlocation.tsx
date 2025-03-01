import { useEffect, useState } from "react";
import { middleOfMumbai } from "../../../lib/constants";
import { Marker, Popup, useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "../../../lib/api";

interface DataPoint {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

export default function GetLocation() {
  const [popupLocation, setPopupLocation] =
    useState<[number, number]>(middleOfMumbai);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const mapContext = useMap();
  const map = mapContext?.current;

  useEffect(() => {
    if (!map) return;

    (async () => {
      try {
        const location = await getLocation();
        if (
          location &&
          Array.isArray(location) &&
          location.length === 2 &&
          !isNaN(location[0]) &&
          !isNaN(location[1])
        ) {
          setPopupLocation(location);
          map.flyTo({ center: location, zoom: 14, essential: true });
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    })();
  }, [map]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("https://your-api-endpoint.com/data");
        if (!response.ok) throw new Error("Network response was not ok");
        const data: DataPoint[] = await response.json();
        setDataPoints(data);
      } catch (error) {
        console.error("Error fetching data points:", error);
      }
    })();
  }, []);

  if (!map) return null;

  return (
    <>
      {dataPoints.map((point) => (
        <Marker key={point.id} longitude={point.longitude} latitude={point.latitude}>
          <div
            className="bg-red-500 w-3 h-3 rounded-full cursor-pointer"
            title={point.name}
          ></div>
        </Marker>
      ))}
      <Popup longitude={popupLocation[0]} latitude={popupLocation[1]}>
        <h3>You are approximately here!</h3>
      </Popup>
    </>
  );
}
