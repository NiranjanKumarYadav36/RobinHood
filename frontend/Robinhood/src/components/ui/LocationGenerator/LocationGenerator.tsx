import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "@vis.gl/react-maplibre";
import { useAuth } from "../../../context/AuthContext";
import axiosclient from "../AxiosClient/axiosclient";

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
  const map = mapContext?.current;

  useEffect(() => {
    if (!map || !user) return;

    const fetchLocations = async () => {
      try {
        const response = await axiosclient.get("/location", {
          params: { role: user.user, city: user.city, state: user.state },
          withCredentials: true,
        });

        console.log("API Response:", response.data); // Debugging

        if (response.data.success && response.data.data) {
          const extractedLocations: DataPoint[] = [];

          // Extract data from each role category
          for (const [role, entries] of Object.entries(response.data.data)) {
            if (Array.isArray(entries)) {
              entries.forEach((entry: any) => {
                if (entry.location) {
                  extractedLocations.push({
                    id: entry._id,
                    latitude: parseFloat(entry.location.latitude),
                    longitude: parseFloat(entry.location.longitude),
                    name: entry.name,
                    user: role, // Role from the key (volunteer, sponsor, etc.)
                  });
                }
              });
            }
          }

          setLocations(extractedLocations);
          console.log(extractedLocations)
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
          <div className="bg-red-500 p-2 text-white rounded-full text-xs">
            📍 {location.name} ({location.user})
          </div>
        </Marker>
      ))}
      {user && user.city && user.state && (
        <Popup longitude={user?.location?.longitude} latitude={user?.location?.latitude}>
        <h3>Your location: {user.city}, {user.state}</h3>
      </Popup>
      )}
    </>
  );
}
