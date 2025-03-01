import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel, DistributionCenterModel, UserRole } from "../src/models/Food.model"; // Adjust path if needed
import { connectDB } from "./config/db"; // Ensure correct DB connection

// Default location (Mumbai)
const DEFAULT_LOCATION = {
  latitude: 19.0760,
  longitude: 72.8777
};

// Cities in Maharashtra
const cities = [
  "Mumbai",
  "Pune",
  "Nashik",
  "Nagpur",
  "Thane",
  "Aurangabad",
  "Navi Mumbai",
  "Kolhapur",
  "Amravati",
  "Solapur"
];

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
        location: DEFAULT_LOCATION
      });

      // Create a distribution center for the same city
      const newDC = await DistributionCenterModel.create({
        name: `Distribution Center - ${city}`,
        state: "Maharashtra",
        city,
        admin: newVolunteerT2._id,
        location: DEFAULT_LOCATION
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
