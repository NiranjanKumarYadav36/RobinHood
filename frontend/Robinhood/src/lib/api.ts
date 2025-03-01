import { middleOfMumbai } from "./constants";

export interface LocationResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export async function getLocation(): Promise<[number, number]> {
    try {
      const response = await fetch("http://ip-api.com/json/");
      const json = (await response.json()) as LocationResponse;
  
      if (typeof json.lat === "number" && typeof json.lon === "number") {
        return [json.lon, json.lat]; // Ensures tuple type [number, number]
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  
    return middleOfMumbai; // Ensure fallback also has correct type
  }
  