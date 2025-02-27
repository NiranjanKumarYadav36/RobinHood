import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

config();

const app = express();
const port = process.env.PORT || 5050;

app.listen(port, );