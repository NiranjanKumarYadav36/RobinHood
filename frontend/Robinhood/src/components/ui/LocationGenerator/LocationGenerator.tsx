import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "@vis.gl/react-maplibre";
import { useAuth } from "../../../context/AuthContext";
import axiosclient from "../AxiosClient/axiosclient";
import { MapPin, Circle } from "lucide-react"; // Lucide icons

interface DataPoint {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  user: string;
}

export default function GetLocation() {
  const { user } = useAuth();
  const [locations, setLocations] = useState<DataPoint[]>([]);
  const mapContext = useMap();
  const map = mapContext?.current; // Ensure correct reference

  useEffect(() => {
    if (!map || !user) return;

    const fetchLocations = async () => {
      try {
        const response = await axiosclient.get("/location", {
          params: { role: user.user, city: user.city, state: user.state },
          withCredentials: true,
        });

        console.log("API Response:", response.data);

        if (response.data.success && response.data.data) {
          const extractedLocations: DataPoint[] = [];

          for (const [role, entries] of Object.entries(response.data.data)) {
            if (Array.isArray(entries)) {
              entries.forEach((entry: any) => {
                if (entry.location?.latitude && entry.location?.longitude) {
                  extractedLocations.push({
                    id: entry._id,
                    latitude: parseFloat(entry.location.latitude),
                    longitude: parseFloat(entry.location.longitude),
                    name: entry.name,
                    user: role,
                  });
                }
              });
            }
          }

          setLocations(extractedLocations);
        } else {
          console.error("Invalid response format:", response.data);
          setLocations([]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      }
    };

    fetchLocations();
  }, [map, user]);

  if (!map || locations.length === 0) return null;

  return (
    <>
      {locations.map((location) => (
        <Marker key={location.id} longitude={location.longitude} latitude={location.latitude}>
          <div className="flex items-center justify-center">
            {location.user === "distribution_center" ? (
              <Circle className="text-blue-500 w-6 h-6" />
            ) : location.user === "volunteer" ? (
              <MapPin className="text-green-500 w-6 h-6" />
            ) : (
              <MapPin className="text-red-500 w-6 h-6" />
            )}
          </div>
        </Marker>
      ))}

      {user?.location?.longitude && user?.location?.latitude && (
        <Popup longitude={user.location.longitude} latitude={user.location.latitude}>
          <h3 className="text-sm font-semibold">Your location: {user.city}, {user.state}</h3>
        </Popup>
      )}
    </>
  );
}
