console.clear();
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";

import connectDB from "./db/database";
import router from "./routes/authentication";

connectDB();

const app = express();
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(router);

const server = http.createServer(app);

server.listen(5174, () => {
  console.log(`Server running on http://localhost:5174`);
});
