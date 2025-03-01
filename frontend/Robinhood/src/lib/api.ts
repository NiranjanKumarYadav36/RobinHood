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
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve([position.coords.longitude, position.coords.latitude]);
          },
          async (error) => {
            console.error("Geolocation error:", error);
            resolve(await getLocationFromIP());
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        resolve(getLocationFromIP());
      }
    });
  }
  
  async function getLocationFromIP(): Promise<[number, number]> {
    try {
      const response = await fetch("http://ip-api.com/json/");
      const json = (await response.json()) as LocationResponse;
      if (typeof json.lat === "number" && typeof json.lon === "number") {
        return [json.lon, json.lat];
      }
    } catch (error) {
      console.error("Error fetching location from IP:", error);
    }
    return middleOfMumbai;
  }
  
  