import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useAuth } from "../../../context/AuthContext";
import axiosclient from "../AxiosClient/axiosclient";

// Define different colors for roles
const roleColors = {
  distributionCenters: "blue",
  volunteers: "green",
  sponsors : "yellow",
  default: "red",
};

// Create marker icon dynamically
const createMarker = (color: string) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch User Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  // Fetch API Data
  useEffect(() => {
    if (!user) return;

    const fetchLocations = async () => {
      try {
        const response = await axiosclient.get("/location", {
          params: { role: user.user, city: user.city, state: user.state },
          withCredentials: true,
        });

        console.log("API Response:", response.data); // Debugging

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

          console.log("Extracted Locations:", extractedLocations); // Debugging
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
  }, [user]);

  if (loading) return <p>Loading map...</p>;

  const defaultCenter: [number, number] = [19.076, 72.8777]; // Default Mumbai
  const mapCenter = userLocation || (locations.length > 0 ? [locations[0].latitude, locations[0].longitude] : defaultCenter);

  return (
    <div className="relative">
      {/* Map Container */}
      <MapContainer center={mapCenter} zoom={12} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={createMarker("black")}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* API Data Markers */}
        {locations.length > 0 &&
          locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={createMarker(roleColors[location.user] || roleColors.default)}
            >
              <Popup>
                <h3 className="text-sm font-semibold">{location.name}</h3>
                <p className="text-xs text-gray-600">Role: {location.user.replace("_", " ")}</p>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Legend Container */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md">
        <h4 className="font-semibold">Legend</h4>
        <ul className="text-sm">
          <li className="flex items-center">
            <span className="w-4 h-4 bg-blue-500 rounded-full inline-block mr-2"></span> Distribution Center
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-full inline-block mr-2"></span> Volunteer
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 bg-yellow-500 rounded-full inline-block mr-2"></span> Sponsers
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 bg-red-500 rounded-full inline-block mr-2"></span> Red
          </li>
        </ul>
      </div>
    </div>
  );
}
