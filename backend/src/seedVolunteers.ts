import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel, DistributionCenterModel, UserRole } from "../src/models/Food.model"; // Adjust path if needed
import { connectDB } from "./config/db"; // Ensure correct DB connection

// Default location for volunteers (Mumbai)
const DEFAULT_LOCATION = {
  latitude: 19.0760,
  longitude: 72.8777
};

// Define city locations with proper type
const cityLocations: Record<string, { latitude: number; longitude: number }> = {
  Mumbai: { latitude: 19.0760, longitude: 72.8777 },
  Pune: { latitude: 18.5204, longitude: 73.8567 },
  Nashik: { latitude: 19.9975, longitude: 73.7898 },
  Nagpur: { latitude: 21.1458, longitude: 79.0882 },
  Thane: { latitude: 19.2183, longitude: 72.9781 },
  Aurangabad: { latitude: 19.8762, longitude: 75.3433 },
  "Navi Mumbai": { latitude: 19.0330, longitude: 73.0297 },
  Kolhapur: { latitude: 16.7050, longitude: 74.2433 },
  Amravati: { latitude: 20.9374, longitude: 77.7796 },
  Solapur: { latitude: 17.6599, longitude: 75.9064 }
};

// Cities in Maharashtra
const cities = Object.keys(cityLocations);

// Function to format email
const formatEmail = (city: string) =>
  `volunteer_t2_${city.toLowerCase().replace(/\s+/g, "_")}@example.com`;

async function seedData() {
  try {
    await connectDB(); // Connect to MongoDB
    console.log("🚀 Deleting existing data...");

    // Delete previous volunteers (role: VOLUNTEER_T2) and DCs
    await UserModel.deleteMany({ role: UserRole.VOLUNTEER_T2 });
    await DistributionCenterModel.deleteMany({});
    console.log("✅ Old volunteer_t2 and distribution centers deleted.");

    const volunteerT2List = [];
    const dcList = [];

    for (const city of cities) {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash("robinhood", 10);

      // Create a new volunteer_t2
      const newVolunteerT2 = await UserModel.create({
        name: `Volunteer T2 - ${city}`,
        email: formatEmail(city),
        password: hashedPassword, // Store hashed password
        role: UserRole.VOLUNTEER_T2,
        state: "Maharashtra",
        city,
        location: DEFAULT_LOCATION // Default Mumbai location
      });

      // Ensure the city exists in cityLocations
      const location = cityLocations[city];

      // Create a distribution center with a unique location for the city
      const newDC = await DistributionCenterModel.create({
        name: `Distribution Center - ${city}`,
        state: "Maharashtra",
        city,
        admin: newVolunteerT2._id,
        location // Unique location for DC
      });

      console.log(`✅ Created Volunteer_T2 & DC for ${city}`);

      volunteerT2List.push(newVolunteerT2);
      dcList.push(newDC);
    }

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
