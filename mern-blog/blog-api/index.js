import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./src/routes/user.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB)
  .then(console.log("Database connected"))
  .catch((error) => console.log(error));

const app = express();

app.use("/api/user", userRouter);

app.listen(5174, () => {
  console.log("Server running on port 5174!!");
});
