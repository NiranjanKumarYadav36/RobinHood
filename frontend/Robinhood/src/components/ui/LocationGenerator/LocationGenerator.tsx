import React, { useEffect, useState } from "react";
import { Marker } from "@vis.gl/react-maplibre";
import axiosclient from "../AxiosClient/axiosclient";
import { useAuth } from "../../../context/AuthContext";

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
}

const LocationGenerator: React.FC = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchLocations = async () => {
      try {
        const response = await axiosclient.get("/locations", {
          params: { role: user.role }, // Send user role as parameter
        });
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [user]);

  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.id}
          longitude={location.longitude}
          latitude={location.latitude}
        >
          <div className="bg-red-500 p-2 text-white rounded-full text-xs">
            📍 {location.name}
          </div>
        </Marker>
      ))}
    </>
  );
};

export default LocationGenerator;
