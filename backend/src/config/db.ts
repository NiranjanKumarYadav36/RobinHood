import { config } from "dotenv";
import mongoose from "mongoose";

config();

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error:any) {
        console.log(`Error: ${error.message}`);
        process.exit(1); // process code 1 means exit with failure
    }
};