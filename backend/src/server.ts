import express, { NextFunction, Request, response, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";

config();

const app = express();
const port = process.env.PORT || 5050;

app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
);

app.use(cookieParser());

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

process.on("uncaughtException", (err: Error) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
    console.error("Unhandled Rejection! 💥 Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});

// Start the server and listen on the specified port
const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
};