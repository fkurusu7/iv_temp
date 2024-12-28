import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { logger } from "./utils/logger.js";
import authRouter from "./routes/auth.route.js";
import postsRouter from "./routes/posts.route.js";
import tagsRouter from "./routes/tags.route.js";

// random string from node:
// require("crypto").randomBytes(64).toString("hex")

mongoose
  .connect(process.env.MONGO_DB_CONNECTION, { autoIndex: true })
  .then(() => logger.success("MongoDB connected successfully"))
  .catch((err) => logger.error("MongoDB connection error:", err));

const appServer = express();
appServer.use(express.json());
appServer.use(cookieParser());
// Use the response capture middleware first
appServer.use(logger.responseCapture);
// Use the request logger middleware
appServer.use(logger.requestLogger);

// ROUTES
appServer.use("/api/auth", authRouter);
appServer.use("/api/posts", postsRouter);
appServer.use("/api/tags", tagsRouter);

// handles errors
appServer.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error - Index";
  res.status(statusCode).json({ success: false, statusCode, message });
});

const PORT = process.env.SERVER_PORT || 5174;
appServer.listen(PORT, () => logger.server(PORT));
