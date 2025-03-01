import { useEffect, useState } from "react";
import { middleOfMumbai } from "../../../lib/constants";
import { Popup, useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "../../../lib/api";

export default function GetLocation() {
  const [popupLocation, setPopupLocation] = useState<[number, number]>(middleOfMumbai);
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

  if (!map) return null;

  return (
    <Popup longitude={popupLocation[0]} latitude={popupLocation[1]}>
      <h3>Me</h3>
    </Popup>
  );
}
