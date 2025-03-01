import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "@vis.gl/react-maplibre";
import { useAuth } from "../../../context/AuthContext";
import axiosclient from "../AxiosClient/axiosclient";
import { MapPin, Warehouse, User, Users } from "lucide-react"; // Custom icons

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
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null); // State to track selected marker
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
        <Marker
          key={location.id}
          longitude={location.longitude}
          latitude={location.latitude}
          onClick={() => setSelectedMarker(location.id)} // Open popup on click
        >
          <div className="relative flex flex-col items-center cursor-pointer">
            {/* Icon based on role */}
            {location.user === "distribution_center" ? (
              <Warehouse className="text-blue-500 w-7 h-7" />
            ) : location.user === "volunteer" ? (
              <User className="text-green-500 w-7 h-7" />
            ) : location.user === "donor" ? (
              <Users className="text-yellow-500 w-7 h-7" />
            ) : (
              <MapPin className="text-red-500 w-7 h-7" />
            )}

            {/* Show Popup when clicked */}
            {selectedMarker === location.id && (
              <Popup longitude={location.longitude} latitude={location.latitude} onClose={() => setSelectedMarker(null)}>
                <h3 className="text-sm font-semibold">{location.name}</h3>
                <p className="text-xs text-gray-600">
                  Role: {location.user.replace("_", " ")}
                </p>
              </Popup>
            )}
          </div>
        </Marker>
      ))}
    </>
  );
}